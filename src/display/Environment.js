(function() { 

otre.display.getEnvironment = function(divName) {
  return (new GuiEnvironment()).initialize();
};

var GuiEnvironment = function(options) {
  this.divName = options.divName;
  this.intersections = options.intersections;
  this.useMenuBar = options.useMenuBar;
  this.cropBox = options.cropBox;
  this.divHeight = options.divHeight;
  this.divWidth = options.divWidth;
};

GuiEnvironment.prototype = {
  // Initialize the internal variables that tell where to place the go broard.
  initialize: function() {
    var squareEdge = otre.math.min(divHeight, divWidth);
    var menubarPercent = useMenuBar ? 10 : 0;
    var boardWidth = squareEdge;
    var totalHeight = boardSide + menubarHeight;
    var boardHeight = squareEdge;

    this.leftEdge = (divWidth - boardWidth) / 2;
    this.rightEdge = divWidth - this.leftEdge;
    this.topEdge     = (divHeight - totalHeight) / 2;
    this.botEdge     = divHeight - this.topEdge;
    this.center = otre.util.point(
        (boardWidth / 2) + this.leftEdge, 
        (boardHeight / 2) + this.topEdge);

    var xpoints   = cropbox.botRight.x - cropbox.topLeft.x + 1;
    var ypoints   = cropbox.botRight.y - cropbox.topLeft.y + 1;

    // We Use 2/3 of a space to provide a buffer around the board.
    this.spacing   = boardSide / (xpoints + 1/3);

    var edgeAmount = 2/3 * spacing;
    var edgeSpace = spacing - edgeAmount;

    this.lineLength = boardSide - 2 * edgeAmount;

        // different if cropbox makes a rectangle
    var xbuffer   = leftEdge + edgeAmount;
    var ybuffer   = topEdge + edgeAmount;

    this.topLine   = ybuffer;
    this.botLine   = top + lineLength;
    this.leftLine  = xbuffer;
    this.rightLine = left + lineLength;

    // Unused currently -- for a cropbox
    var height    = bot - top,
        topExt    = (cropbox.topLeft.y > 1) ? spacing / 2 : 0,
        botExt    = (cropbox.botRight.y < maxIntersects) ? spacing / 2 : 0,
        leftExt   = (cropbox.topLeft.x > 1) ? spacing / 2 : 0,
        rightExt  = (cropbox.botRight.x < maxIntersects) ? spacing / 2 : 0;

    if ((bot - top).toInt !== (right - left).toInt)
      throw "Height and Width must be equal: h: " + (bot - top)
          + ", w: " + (right- left);

    return this;
  },

  resetDivDimensions: function() {
    this.divHeight  = ($("#" + this.divName).innerHeight());
    this.divWidth   = ($("#" + this.divName).innerWidth());
    return this.initialize();
  }
};

})();
