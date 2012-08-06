(function() { 
var util = otre.util;

otre.display.getEnvironment = function(divName) {
  return (new GuiEnvironment()).initialize();
};

var GuiEnvironment = function(options) {
  this.divName = options.divName;
  this.intersections = options.intersections;
  this.cropBox = options.cropBox;
  this.divHeight = options.divHeight;
  this.divWidth = options.divWidth;
};

GuiEnvironment.prototype = {
  // Initialize all the bounding boxes for a simple board.
  initializeSimpleBoard: function() {
    return this.initialize(false /* use menu bar */);
  },

  // Initialize all the bounding boxes 
  initializeMenuBoard: function() {
  
  },

  // Initialize the internal variables that tell where to place the go broard.
  initialize: function(useMenuBar) {
    var divHeight = this.divHeight,
        divWidth  = this.divWidth,

        // onboard, top, bot, left, right:
        // textarea      = "bot"
        squareEdge    = otre.math.min(divHeight, divWidth),
        menubarPercent = useMenuBar ? 10 : 0,
        boardSide   = squareEdge * (1 - menubarPercent),
        menubarHeight = squareEdge * (menubarPercent),

        boardHeight = boardSide,
        totalHeight = boardSide + menubarHeight,
        boardWidth  = boardSide,
        leftEdge    = (divWidth - boardWidth) / 2,
        rightEdge   = divWidth - leftEdge,
        topEdge     = (divHeight - totalHeight) / 2,
        botEdge     = divHeight - topEdge,

        // center of the Go Board;
        center = otre.util.point(
            (boardWidth / 2) + leftEdge, (boardHeight / 2) + topEdge),

        xpoints   = cropbox.botRight.x - cropbox.topLeft.x + 1,
        ypoints   = cropbox.botRight.y - cropbox.topLeft.y + 1,

        spacing   = boardSide / (xpoints + 1/3),

        edgeAmount = 2/3 * spacing,
        edgeSpace = spacing - edgeAmount,
        lineLength = boardSide - 2 * edgeAmount,

        // different if cropbox makes a rectangle
        xbuffer   = leftEdge + edgeAmount,
        ybuffer   = topEdge + edgeAmount,

        top       = ybuffer,
        bot       = top + lineLength,
        left      = xbuffer,
        right     = left + lineLength,
        width     = right - left,
        height    = bot - top,
        topExt    = (cropbox.topLeft.y > 1) ? spacing / 2 : 0,
        botExt    = (cropbox.botRight.y < maxIntersects) ? spacing / 2 : 0,
        leftExt   = (cropbox.topLeft.x > 1) ? spacing / 2 : 0,
        rightExt  = (cropbox.botRight.x < maxIntersects) ? spacing / 2 : 0;

    this.divBox = util.bbox(util.point(0, 0), util.point(divWidth, divHeight));
    this.goBoardBox = util.bbox(
        util.point(leftEdge, topEdge), util.point(rightEdge, botEdge));
    this.goBoardLineBox = util.bbox(
        util.point(left, top), util.point(right, bot));
    // TODO: MenuBar Box

    return this;
  },

  resetDivDimensions: function() {
    this.divHeight  = ($("#" + this.divName).innerHeight());
    this.divWidth   = ($("#" + this.divName).innerWidth());
    return this.initialize();
  }
};

})();
