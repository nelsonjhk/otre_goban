// bounding box
// Perhaps this should be moved to display?
(function() {
otre.display.bboxFromPts = function(topLeftPt, botRightPt) {
  return new BoundingBox(topLeftPt, botRightPt);
};

otre.display.bbox = function(topLeft, width, height) {
  return new BoundingBox(
    topLeft,
    otre.util.point(
        topLeft.x + width,
        topLeft.y + height));
}


// A bounding box, generally for a graphical object.
var BoundingBox = function(topLeftPt, botRightPt) {
  this.topLeft = topLeftPt;
  this.botRight = botRightPt;
  this.center = otre.util.point(
      otre.math.abs((botRightPt.x - topLeftPt.x) / 2),
      otre.math.abs((botRightPt.y - topLeftPt.y) / 2));
  this.width = otre.math.abs(botRightPt.x - topLeftPt.x);
  this.height = otre.math.abs(botRightPt.y - topLeftPt.y);
};


BoundingBox.prototype = {
  drawBox: function(paper) {
     return 
        paper.rect(this.topLeft.x, this.topLeft.y, this.width, this.height);
  }
};


})();
