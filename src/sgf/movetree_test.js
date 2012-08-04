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
    equal(mt.getNodeNum(), 0, 'movenum');
    var prop = mt.getFirstProp("FF");
    ok(mt.hasProp("FF"), "should return true for an existing prop");
    ok(prop === "4", "should get an existing property");

    ok(!mt.hasProp("ZZ"), "should return false for non-real prop");
    ok(mt.getProp("ZZ") === util.none,
        "should return nothing for a non-real prop");

    ok(!mt.hasProp("B"), "should return false for non-existent prop");
    ok(mt.getProp("B") === util.none,
        "should return nothing for a non-existent prop");
  });

  test("Test that property retrieval for multiple props works", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    equal(mt.getProp("AB")[1], "qa", "Should get the second property");
    equal(mt.getProp("AW").toString(), ["pa", "pb", "sb", "pc", "qc", "sc", "qd",
        "rd", "sd"].toString(), "should get a list of values");
  });

  test("that sgf point conversion works", function() {
    var pt = movetree.sgfCoordToPoint("ac");
    equal(pt.x, 0, "pt.x");
    equal(pt.y, 2, "pt.y");
    equal(movetree.pointToSgfCoord(pt), "ac", "pt to sgf coord");
  });

  test("that moving up / down works correctly", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    equal(mt.getNodeNum(), 0, 'move num');
    equal(mt.getVarNum(), 0, 'var num');
    equal(mt.getAllNextNodes().length, 3, 'next nodes');

    mt.moveDown();
    equal(mt.getNodeNum(), 1, 'move num');
    equal(mt.getVarNum(), 0, 'var num');
    equal(mt.getAllNextNodes().length, 1, 'next nodes');
    equal(mt.getProp("B"), "sa", "stoneMove");

    mt.moveUp();
    equal(mt.getNodeNum(), 0, 'move num');
    equal(mt.getVarNum(), 0, 'var num');
    equal(mt.getAllNextNodes().length, 3, 'next nodes');

    mt.moveDown(1);
    equal(mt.getNodeNum(), 1, 'move num');
    equal(mt.getVarNum(), 1, 'var num');
    equal(mt.getAllNextNodes().length, 1, 'next nodes');
    equal(mt.getProp("B"), "ra", "stoneMove");
  });

  test("that edge case of moving up: only one move left - works."
      + "In other words, don't remove the last move", function() {
    var mt = movetree.getFromSgf(sgfs.easy);
    mt.moveUp();
    equal(mt.getNodeNum(), 0, 'move num');
    equal(mt.getVarNum(), 0, 'var num');
    equal(mt.getAllNextNodes().length, 3, 'next nodes');
  });

  test("Test that deleting a property works", function() {
    var mt = movetree.getFromSgf(sgfs.veryeasy);
    equal(mt.getProp("AP"), "CGoban:3", "should get the AP prop");
    equal(mt.deleteProp("AP"), "CGoban:3", "should delete the prop");
    ok(!mt.hasProp("AP"), "Prop shouldn't exist anymore");
  });

  test("Test that adding properties works", function() {
    var movt = movetree.getFromSgf(sgfs.veryeasy);
    movt.addProp("C", "foo")
        .addProp("C", "bap")
        .addProp("EV", "tourny");
    equal(movt.getProp("C"), "foo", "Should get the correct comment");
    equal(movt.getProp("EV"), "tourny", "Chaining should work");
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
    equal(movt.getProp("C"), "0th", "Should get the correct comment");
    equal(movt.getNodeNum(), 0, "Should get the move num");
    equal(movt.getVarNum(), 0, "Should get the var num");

    movt.moveDown()
    equal(movt.getProp("C"), "1.0", "Should get the correct comment");
    equal(movt.getNodeNum(), 1, "Should get the move num");
    equal(movt.getVarNum(), 0, "Should get the var num");

    movt.moveUp()
    movt.moveDown(1)
    equal(movt.getProp("C"), "1.1", "Should get the correct comment");
    equal(movt.getNodeNum(), 1, "Should get the move num");
    equal(movt.getVarNum(), 1, "Should get the var num");
  });

  test("Get Property as a Point", function() {
    var movt = movetree.getInstance();
    movt.addProp("C", "0th")
        .addProp("EV", "AOEU")
        .addNewNode()
        .addProp("B", "pb");
    equal(movt.getPropPoint("B").x, 15,
        "Should get and covert the x coord correctly");
    equal(movt.getPropPoint("B").y, 1,
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
    equal(output.toString(), expected.toString(),
        'simple DFS recursing should work');
  });
};
