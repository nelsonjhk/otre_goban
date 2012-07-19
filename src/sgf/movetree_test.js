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
    var mt = movetree.getFromSgf(sgfs.veryeasy);
    equal(mt.getCurrentMoveNum(), 0, 'movenum');
    var prop = mt.getCurrentProp("FF");
    equal(prop, "4", "should get an existing property");
    equal(mt.getCurrentProp("ZZ"), util.none,
        "should return nothing for a fake prop");
    equal(mt.getCurrentProp("B"), util.none,
        "should return nothing for a non-existent prop");
  });

  test("that sgf point conversion works", function() {
    var pt = movetree.sgfCoordToPoint("ac");
    equal(pt.x, 0, "pt.x");
    equal(pt.y, 2, "pt.y");
    equal(movetree.pointToSgfCoord(pt), "ac", "pt to sgf coord");
  });

  test("that moving up / down works correctly", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    equal(mt.getCurrentMoveNum(), 0, 'move num');
    equal(mt.getAllNextMoves().length, 3, 'next moves');
    mt.moveDown();
    equal(mt.getCurrentMoveNum(), 1, 'move num');
    equal(mt.getAllNextMoves().length, 1, 'next moves');
    equal(mt.getCurrentProp("B"), "sa", "stoneMove");
    mt.moveUp();
    equal(mt.getCurrentMoveNum(), 0, 'move num');
    equal(mt.getAllNextMoves().length, 3, 'next moves');
    mt.moveDown(1);
    equal(mt.getCurrentMoveNum(), 1, 'move num');
    equal(mt.getAllNextMoves().length, 1, 'next moves');
    equal(mt.getCurrentProp("B"), "ra", "stoneMove");
  });

  test("that edge case of moving up: only one move left - works", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    mt.moveUp();
    equal(mt.getCurrentMoveNum(), 0, 'move num');
    equal(mt.getAllNextMoves().length, 3, 'next moves');
  });
};
