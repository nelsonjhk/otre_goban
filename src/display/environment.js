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
};

var GuiEnvironment = function(options) {
  this.divId = options.divId;
  this.displayType = options.displayType || enums.displayTypes.SIMPLE_BOARD;
  this.cropbox = options.cropbox || this.getCropboxFromRegion(
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
        divHeight = this.divHeight,
        divWidth  = this.divWidth,
        cropbox   = this.cropbox,
        displayType = this.displayType,
        dirs = enums.directions,

        // The box for the entire div
        divBox = display.bboxFromPts(
            util.point(0, 0), // top left
            util.point(divWidth, divHeight)), // bottom rigt

        topBar = this._getSidebarBox(displayType, divBox, dirs.TOP),
        leftBar = this._getSidebarBox(displayType, divBox, dirs.LEFT),
        bottomBar = this._getSidebarBox(displayType, divBox, dirs.BOTTOM),
        rightBar = this._getSidebarBox(displayType, divBox, dirs.RIGHT),

        goBoardBox = this._getBoardBox(
            topBar.botRight.y, leftBar.botRight.x,
            bottomBar.topLeft.y, rightBar.topLeft.x),

        // TODO
        goBoardLineBox = this._getGoBoardLineBox(divBox, cropbox);

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

  // Get the bounding box of the side.
  _getSidebarBox: function(displayType, divBox, direction) {
    var dirs = enums.directions,
        dispt = enums.displayTypes,
        top = divBox.topLeft.y,
        bot = divBox.botRight.y,
        left = divBox.topLeft.x,
        right = divbox.botRight.x;

      // LEFT and RIGHT not yet used, so let width = 0
    if (direction === dirs.LEFT) {
      right = divBox.topLeft.x;
    } else if (direction === dirs.RIGHT) {
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

  _getGoBoardBox: function(top, left, bot, right) {
    var height = bot - top,
        width = right - left,
        side = otre.math.min(height, width),
        heightRemain = height - side,
        widthRemain = width - side,
        newLeft = left + widthRemain / 2,
        newRight = newLeft + side,
        newTop = top + heightRemain / 2,
        newBot = newTop + side;
    return otre.display.bboxFromPts(
        util.point(left, top), util.point(right, bot));
  },

  _getGoBoardLineBox: function(boardBox, cropbox) {

  },

  _debugDrawAll: function() {
    this.divBox.draw(this.paper, 'red');
  }
};

})();
