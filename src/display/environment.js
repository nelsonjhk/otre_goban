(function() {
var util = otre.util;
var enums = otre.enums;

otre.display.environment = {
  get: function(options) {
    return new GuiEnvironment(options);
  },

  getInitialized: function(options) {
    return new (GuiEnvironment(options)).initialize();
  },

  // Get the bounding box of a sidebar.
  _getSidebarBox: function(displayType, divBox, direction) {
    var dirs = enums.directions,
        dispt = enums.displayTypes,
        top = divBox.topLeft.y,
        bot = divBox.botRight.y,
        left = divBox.topLeft.x,
        right = divbox.botRight.x;
    if (direction === dirs.LEFT) {
      // LEFT not yet used, so let width = 0
      right = divBox.topLeft.x;
    } else if (direction === dirs.RIGHT) {
      // RIGHT not yet used, so let width = 0
      left = divBox.botRight.x;
    } else if (direction === dirs.TOP) {
      bot = divBox.topLeft.y
      if (displayType === dispt.EXPLAIN_BOARD) {
        bot = 0.05 * divBox.height;
      }
    } else if (direction === dirs.BOT) {
      top = divBox.botRight.y
      if (displayType === dispt.EXPLAIN_BOARD) {
        top = divBox.height * 0.95;
      }
    } else {
      return otre.display.bbox(util.point(0,0), 0, 0);
    }

    return otre.display.bboxFromPts(
        util.point(left, top), util.point(right, bot));
  },

  _getGoBoardBox: function(bbox, cropbox) {
    var side = otre.math.min(bbox.height, bbox.width),
        newLeft = bbox.topLeft.x + (bbox.width - side) / 2,
        newTop = bbox.topLeft.y + (bbox.height - side) / 2;
    return otre.display.bbox(util.point(left, top), side, side);
  },

  _getGoBoardLineBox: function(boardBox, cropbox) {
    var xPoints = cropbox.width,
        yPoints = cropbox.height,
        minPoints = otre.math.min(xPoints, yPoints);
  }
};

var GuiEnvironment = function(options) {
  this.divId = options.divId;
  this.displayType = options.displayType || enums.displayTypes.SIMPLE_BOARD;
  this.cropbox = options.cropbox || otre.display.getCropbox(
      options.displayRegion, options.intersections);

  // We allow the divHeight and divWidth to be specified explicitly, primarily
  // because it's extremely useful for testing.
  this.divHeight = options.divHeight || ($("#" + this.divId).innerHeight());
  this.divWidth = options.divWidth || ($("#" + this.divId).innerWidth());
};

GuiEnvironment.prototype = {
  // Initialize the internal variables that tell where to place the go broard.
  initialize: function() {
    var display = otre.display,
        env = display.environment,
        divHeight = this.divHeight,
        divWidth  = this.divWidth,
        cropbox   = this.cropbox,
        displayType = this.displayType,
        dirs = enums.directions,

        // The box for the entire div
        divBox = display.bboxFromPts(
            util.point(0, 0), // top left
            util.point(divWidth, divHeight)), // bottom rigt

        topBar = env._getSidebarBox(displayType, divBox, dirs.TOP),
        leftBar = env._getSidebarBox(displayType, divBox, dirs.LEFT),
        bottomBar = env._getSidebarBox(displayType, divBox, dirs.BOTTOM),
        rightBar = env._getSidebarBox(displayType, divBox, dirs.RIGHT),

        xPoints = cropbox.width,
        yPoints = cropbox.height,
        minSpacing = boardSide / (otre.math.min(xPoints, yPoints) + 1/3),

        goGoBoardBox = env._getGoBoardBox(otre.bboxFromPts(
            util.point(leftBar.botRight.x, topBar.botRight.y),
            util.point(rightBar.topLeft.x, bottomBar.topLeft.y)),
            cropbox),

        // TODO
        goBoardLineBox = env._getGoBoardLineBox(divBox, cropbox);

    // Move the bars based on the leftover height and width.
    topBar.topLeft.y = topBar.topLeft.y + 
        (goBoardBox.topLeft.y - topBar.botRight.y);
    leftBar.topLeft.x = leftBar.topLeft.x + 
        (goBoardBox.topLeft.x - leftBar.botRight.x);
    bottomBar.topLeft.y = bottomBar.botRight.y - 
        (bottomBar.topLeft.y - goBoardBox.botRight.y);
    rightBar.topLeft.x = rightBar.botRight.x - 
        (bottomBar.topLeft.x - goBoardBox.botRight.x);

    //this.paper = Raphael(this.divId, "100%", "100%")
    return this;
  },

  resetDimensions: function() {
    this.divHeight  = ($("#" + this.divId).innerHeight());
    this.divWidth   = ($("#" + this.divId).innerWidth());
    return this.initialize();
  },


  _debugDrawAll: function() {
    this.divBox.draw(this.paper, 'red');
  }
};

})();
