otre.display.bbox_test = function() {
  var util = otre.util;
  var display = otre.display;
  test("--------Bounding Box Tests--------", function() { ok(true); });

  test("Test that the center is the shifted average", function() {
    var bbox = display.bboxFromPts(
      util.point(1, 1), util.point(19, 21));
    deepEqual(bbox.center.x, 9, "center.x must be 9");
    deepEqual(bbox.center.y, 10, "center.y must be 10");
  });

  test("Width and height should be calculated correctly", function() {
    var bbox = display.bboxFromPts(
      util.point(1, 9), util.point(18, 20));
    deepEqual(bbox.width, 17, "Width should be br.x - tl.x");
    deepEqual(bbox.height, 11, "Width should be br.y - tl.y");

    var bbox = display.bboxFromPts(
      util.point(18, 20), util.point(1, 9));
    deepEqual(bbox.width, -17, "Width should be br.x - tl.x");
    deepEqual(bbox.height, -11, "Width should be br.y - tl.y");
  });

  test("Equality test", function() {
    var bbox = display.bboxFromPts(util.point(1, 9), util.point(18, 20));
    var bbox_v2 = display.bbox(util.point(1, 9), 17, 11);
    var bbox_v3 = display.bbox(util.point(1, 10), 17, 11);
    ok(bbox.equals(bbox_v2), "should be equal");
    ok(!bbox.equals(bbox_v3), "shouldn't be equal");
    ok(!bbox_v2.equals(bbox_v3), "shouldn't be equal");
  });
};
