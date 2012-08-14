// bounding box
// Perhaps this should be moved to display?
(function() {
otre.display.bboxFromPts = function(topLeftPt, botRightPt) {
  return new BoundingBox(topLeftPt, botRightPt);
};

otre.display.bbox = function(topLeft, width, height) {
  return new BoundingBox(
    topLeft, otre.util.point(topLeft.x + width, topLeft.y + height));
}


// A bounding box, generally for a graphical object.
var BoundingBox = function(topLeftPt, botRightPt) {
  this.topLeft = topLeftPt;
  this.botRight = botRightPt;
  this.center = otre.util.point(
      otre.math.abs((botRightPt.x - topLeftPt.x) / 2),
      otre.math.abs((botRightPt.y - topLeftPt.y) / 2));
  this.width = botRightPt.x - topLeftPt.x;
  this.height = botRightPt.y - topLeftPt.y;
};


BoundingBox.prototype = {
  // Draw the bbox (for debugging);
  draw: function(paper, color) {
    var obj = paper.rect(
        this.topLeft.x, this.topLeft.y, this.width, this.height);
    obj.attr({fill:color});
  },

  // Log the points to the console (for debugging);
  log: function() {
    otre.util.logz(this.topLeft);
    otre.util.logz(this.botRight);
    otre.util.logz(this.width);
    otre.util.logz(this.height);
  }, 

  equals: function(other) {
    return other.topLeft && this.topLeft.equals(other.topLeft)
        other.botRight && this.botRight.equals(other.botRight);
  }
};


})();
