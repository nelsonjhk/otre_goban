otre.sgf.movetree_test = function() {
  var movetree = otre.sgf.movetree;
  var sgfs = testdata.sgfs;
  var util = otre.util;
  test("--------SGF Test--------", function() { ok(true); });

  test("that parsing works", function() {
    movetree.getFromSgf(sgfs.veryeasy)
    ok(true, "shouldn't throw an exception (a significant test!)");
  });

  test("that property retrieval works", function() {
    var mt = movetree.getFromSgf(sgfs.veryeasy)
    var prop = mt.getCurrentProp("FF");
    equal("4", prop, "should get an existing property");
    equal(util.none, mt.getCurrentProp("ZZ"), 
        "should return nothing for a fake prop");
    equal(util.none, mt.getCurrentProp("B"), 
        "should return nothing for a non-existent prop");
  });

  test("that sgf point conversion works", function() {
    var pt = movetree.sgfCoordToPoint("ac");
    equal(0, pt.x, "pt.x");
    equal(2, pt.y, "pt.y");
    equal("ac", movetree.pointToSgfCoord(pt), "pt to sgf coord");
  });
};
