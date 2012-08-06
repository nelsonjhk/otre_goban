// bounding box
(function() {
otre.util.bbox = function(topLeftPt, botRightPt) {
  return new BoundingBox(topLeftPt, botRightPt);
};

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


})();
