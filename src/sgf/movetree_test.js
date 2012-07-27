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
    ok(mt.hasProp("FF"), "should return true for an existing prop");
    equal(prop, "4", "should get an existing property");

    ok(!mt.hasProp("ZZ"), "should return false for non-real prop");
    equal(mt.getCurrentProp("ZZ"), util.none,
        "should return nothing for a non-real prop");

    ok(!mt.hasProp("B"), "should return false for non-existent prop");
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
    equal(mt.getCurrentVarNum(), 0, 'var num');
    equal(mt.getAllNextMoves().length, 3, 'next moves');

    mt.moveDown();
    equal(mt.getCurrentMoveNum(), 1, 'move num');
    equal(mt.getCurrentVarNum(), 0, 'var num');
    equal(mt.getAllNextMoves().length, 1, 'next moves');
    equal(mt.getCurrentProp("B"), "sa", "stoneMove");

    mt.moveUp();
    equal(mt.getCurrentMoveNum(), 0, 'move num');
    equal(mt.getCurrentVarNum(), 0, 'var num');
    equal(mt.getAllNextMoves().length, 3, 'next moves');

    mt.moveDown(1);
    equal(mt.getCurrentMoveNum(), 1, 'move num');
    equal(mt.getCurrentVarNum(), 1, 'var num');
    equal(mt.getAllNextMoves().length, 1, 'next moves');
    equal(mt.getCurrentProp("B"), "ra", "stoneMove");
  });

  test("that edge case of moving up: only one move left - works."
      + "In other words, don't remove the last move", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    mt.moveUp();
    equal(mt.getCurrentMoveNum(), 0, 'move num');
    equal(mt.getCurrentVarNum(), 0, 'var num');
    equal(mt.getAllNextMoves().length, 3, 'next moves');
  });

  test("Test that deleting a property works", function() {
    var mt = movetree.getFromSgf(sgfs.veryeasy);
    equal(mt.getCurrentProp("AP"), "CGoban:3", "should get the AP prop");
    equal(mt.deleteProp("AP"), "CGoban:3", "should delete the prop");
    ok(!mt.hasProp("AP"), "Prop shouldn't exist anymore");
  });

  test("Test that adding properties works", function() {
    var movt = movetree.getFromSgf(sgfs.veryeasy);
    movt.addProp("C", "foo")
        .addProp("C", "bap")
        .addProp("EV", "tourny");
    equal(movt.getCurrentProp("C"), "foo", "Should get the correct comment");
    equal(movt.getCurrentProp("EV"), "tourny", "Chaining should work");
  });

  // TODO: Test for adding moves
  test("Adding Nodes Works", function() {
    var movt = movetree.getInstance();
    movt.addProp("C", "0th")
        .addProp("EV", "AOEU")
        .addNewMove()
        .addProp("C", "1.0")
        .moveUp()
        .addNewMove()
        .addProp("C", "1.1")
        .moveToRoot();
    equal(movt.getCurrentProp("C"), "0th", "Should get the correct comment");
    equal(movt.getCurrentMoveNum(), 0, "Should get the move num");
    equal(movt.getCurrentVarNum(), 0, "Should get the var num");

    movt.moveDown()
    equal(movt.getCurrentProp("C"), "1.0", "Should get the correct comment");
    equal(movt.getCurrentMoveNum(), 1, "Should get the move num");
    equal(movt.getCurrentVarNum(), 0, "Should get the var num");

    movt.moveUp()
    movt.moveDown(1)
    equal(movt.getCurrentProp("C"), "1.1", "Should get the correct comment");
    equal(movt.getCurrentMoveNum(), 1, "Should get the move num");
    equal(movt.getCurrentVarNum(), 1, "Should get the var num");
  });
};
