otre.display.cropbox_test = function() {
  var display = otre.display,
      boardRegions = otre.enums.boardRegions;;
  test("--------Cropbox Tests--------", function() { ok(true); });

  test("Cropbox tests for 19x19", function() {
    var box = display.getCropbox(boardRegions.ALL, 19);
    deepEqual(box.topLeft.x, 0, "topLeft.x must be 0, for ALL");
    deepEqual(box.topLeft.y, 0, "topLeft.y must be 0, for ALL");
    deepEqual(box.botRight.x, 18, "botRight.x must be 18, for ALL");
    deepEqual(box.botRight.y, 18, "botRight.y must be 18, for ALL");
  });

  test("Cropbox tests for half boards", function() {
    var lbox = display.getCropbox(boardRegions.LEFT, 19);
    var rbox = display.getCropbox(boardRegions.RIGHT, 19);
    var tbox = display.getCropbox(boardRegions.TOP, 19);
    var bbox = display.getCropbox(boardRegions.BOTTOM, 19);
    deepEqual(lbox.botRight.x, 10, "right coord for LEFT");
    deepEqual(rbox.topLeft.x, 8, "left coord for RIGHT");
    deepEqual(tbox.botRight.y, 10, "bottom corod for TOP");
    deepEqual(bbox.topLeft.y, 8, "top coord  for BOTTOM");
  });

  test("Cropbox tests for quarter boards", function() {
    var tlbox = display.getCropbox(boardRegions.TOP_LEFT, 19);
    var trbox = display.getCropbox(boardRegions.TOP_RIGHT, 19);
    var blbox = display.getCropbox(boardRegions.BOTTOM_LEFT, 19);
    var brbox = display.getCropbox(boardRegions.BOTTOM_RIGHT, 19);
    deepEqual(tlbox.botRight.x, 11, "right coord for TOP LEFT");
    deepEqual(tlbox.botRight.y, 10, "bottom coord for TOP LEFT");

    deepEqual(trbox.topLeft.x, 7, "left coord for TOP RIGHT");
    deepEqual(trbox.botRight.y, 10, "bottom coord for TOP RIGHT");

    deepEqual(blbox.botRight.x, 11, "right coord for BOTTOM LEFT");
    deepEqual(blbox.topLeft.y, 8, "top coord for BOTTOM LEFT");

    deepEqual(brbox.topLeft.x, 7, "left coord for BOTTOM RIGHT");
    deepEqual(brbox.topLeft.y, 8, "top coord for BOTTOM RIGHT");
  });
};
