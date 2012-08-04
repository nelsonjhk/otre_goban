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
    deepEqual(mt.getNodeNum(), 0, 'movenum');
    var prop = mt.getFirstProp("FF");
    ok(mt.hasProp("FF"), "should return true for an existing prop");
    deepEqual(prop, "4", "should get an existing property");

    ok(!mt.hasProp("ZZ"), "should return false for non-real prop");
    deepEqual(mt.getProp("ZZ"), util.none,
        "should return nothing for a non-real prop");

    ok(!mt.hasProp("B"), "should return false for non-existent prop");
    deepEqual(mt.getProp("B"), util.none,
        "should return nothing for a non-existent prop");
  });

  test("Test that property retrieval for multiple props works", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    deepEqual(mt.getProp("AB")[1], "qa", "Should get the second property");
    deepEqual(mt.getProp("AW").toString(), ["pa", "pb", "sb", "pc", "qc", "sc", "qd",
        "rd", "sd"].toString(), "should get a list of values");
  });

  test("that sgf point conversion works", function() {
    var pt = movetree.sgfCoordToPoint("ac");
    deepEqual(pt.x, 0, "pt.x");
    deepEqual(pt.y, 2, "pt.y");
    deepEqual(movetree.pointToSgfCoord(pt), "ac", "pt to sgf coord");
  });

  test("that moving up / down works correctly", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    deepEqual(mt.getNodeNum(), 0, 'move num');
    deepEqual(mt.getVarNum(), 0, 'var num');
    deepEqual(mt.getAllNextNodes().length, 3, 'next nodes');

    mt.moveDown();
    deepEqual(mt.getNodeNum(), 1, 'move num');
    deepEqual(mt.getVarNum(), 0, 'var num');
    deepEqual(mt.getAllNextNodes().length, 1, 'next nodes');
    deepEqual(mt.getFirstProp("B"), "sa", "stoneMove");

    mt.moveUp();
    deepEqual(mt.getNodeNum(), 0, 'move num');
    deepEqual(mt.getVarNum(), 0, 'var num');
    deepEqual(mt.getAllNextNodes().length, 3, 'next nodes');

    mt.moveDown(1);
    deepEqual(mt.getNodeNum(), 1, 'move num');
    deepEqual(mt.getVarNum(), 1, 'var num');
    deepEqual(mt.getAllNextNodes().length, 1, 'next nodes');
    deepEqual(mt.getFirstProp("B"), "ra", "stoneMove");
  });

  test("that edge case of moving up: only one move left - works."
      + "In other words, don't remove the last move", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    mt.moveUp();
    deepEqual(mt.getNodeNum(), 0, 'move num');
    deepEqual(mt.getVarNum(), 0, 'var num');
    deepEqual(mt.getAllNextNodes().length, 3, 'next nodes');
  });

  test("Test that deleting a property works", function() {
    var mt = movetree.getFromSgf(sgfs.veryeasy);
    deepEqual(mt.getFirstProp("AP"), "CGoban:3", "should get the AP prop");
    deepEqual(mt.deleteProp("AP")[0], "CGoban:3", "should delete the prop");
    ok(!mt.hasProp("AP"), "Prop shouldn't exist anymore");
  });

  test("Test that adding properties works", function() {
    var movt = movetree.getFromSgf(sgfs.veryeasy);
    movt.addProp("C", "foo")
        .addProp("C", "bap")
        .addProp("EV", "tourny");
    deepEqual(movt.getProp("C"), "foo", "Should get the correct comment");
    deepEqual(movt.getProp("EV"), "tourny", "Chaining should work");
  });

  // TODO: Test for adding nodes
  test("Adding Nodes Works", function() {
    var movt = movetree.getInstance();
    movt.addProp("C", "0th")
        .addProp("EV", "AOEU")
        .addNewNode()
        .addProp("C", "1.0")
        .moveUp()
        .addNewNode()
        .addProp("C", "1.1")
        .moveToRoot();
    deepEqual(movt.getProp("C"), "0th", "Should get the correct comment");
    deepEqual(movt.getNodeNum(), 0, "Should get the move num");
    deepEqual(movt.getVarNum(), 0, "Should get the var num");

    movt.moveDown()
    deepEqual(movt.getProp("C"), "1.0", "Should get the correct comment");
    deepEqual(movt.getNodeNum(), 1, "Should get the move num");
    deepEqual(movt.getVarNum(), 0, "Should get the var num");

    movt.moveUp()
    movt.moveDown(1)
    deepEqual(movt.getProp("C"), "1.1", "Should get the correct comment");
    deepEqual(movt.getNodeNum(), 1, "Should get the move num");
    deepEqual(movt.getVarNum(), 1, "Should get the var num");
  });

  test("Get Property as a Point", function() {
    var movt = movetree.getInstance();
    movt.addProp("C", "0th")
        .addProp("EV", "AOEU")
        .addNewNode()
        .addProp("B", "pb");
    deepEqual(movt.getPropPoint("B").x, 15,
        "Should get and covert the x coord correctly");
    deepEqual(movt.getPropPoint("B").y, 1,
        "Should get and covert the y coord correctly");
  });

  test("Recursing through the nodes works", function() {
    var movt = movetree.getInstance();
    var conv = movetree.sgfCoordToPoint; 
    movt.addProp("C", "0th").addProp("EV", "AOEU")
        .addNewNode().addProp("B", "pb")
        .addNewNode().addProp("W", "nc")
        .addNewNode().addProp("B", "cc")
        .moveToRoot()
        .addNewNode().addProp("B", "dd");
    var expected = [
        'b_' + conv('pb'),
        'w_' + conv('nc'),
        'b_' + conv('cc'),
        'b_' + conv('dd')];
    var output = [];
    movt.recurseFromRoot(function(mt) {
      var buff = '';
      if (mt.hasProp('B')) {
        buff = 'b_' + mt.getPropPoint('B');
      } else if (mt.hasProp('W')) {
        buff = 'w_' + mt.getPropPoint('W');
      }
      if (buff !== '') output.push(buff);
    });
    deepEqual(output.toString(), expected.toString(),
        'simple DFS recursing should work');
  });
};
