otre.rules.goban_test = function() {
  var rules = otre.rules;
  var util = otre.util
  var BLACK = otre.enums.states.BLACK;
  var WHITE = otre.enums.states.WHITE;
  var EMPTY = otre.enums.states.EMPTY;

  test("--------Goban Test--------", function() { ok(true); });

  test("Successful addStone", function() {
    var test_goban = rules.goban.getInstance();
    var result = test_goban.addStone(util.point(1, 1), BLACK);
    equal(result.captures.length, 0, "list must be only 1 long");
    ok(result.successful, "must be successful");
  });

  test("Fail: Out of bounds: <0", function() {
    var test_goban = rules.goban.getInstance();
    var result = test_goban.addStone(util.point(-1, 1), BLACK);
    equal(result.captures.length, 0, "list must be only 1 long");
    ok(!result.successful, "must be not be successful");
  });

  test("Fail: Out of bounds: >=19", function() {
    var test_goban = rules.goban.getInstance();
    var result = test_goban.addStone(util.point(2, 19), BLACK);
    equal(result.captures.length, 0, "list must be only 1 long");
    ok(!result.successful, "must be not be successful");
  });

  test("Fail: Existing stone", function() {
    var test_goban = rules.goban.getInstance();
    test_goban.addStone(util.point(1, 1), BLACK);
    var result = test_goban.addStone(util.point(1, 1), BLACK);
    equal(result.captures.length, 0, "list must be only 1 long");
    ok(!result.successful, "must be not be successful");
  });

  test("Capture -- center", function() {
    var test_goban = rules.goban.getInstance(9);
    test_goban.addStone(util.point(1, 1), BLACK);
    test_goban.addStone(util.point(0, 2), BLACK);
    test_goban.addStone(util.point(2, 2), BLACK);
    test_goban.addStone(util.point(1, 2), WHITE);
    var result = test_goban.addStone(util.point(1, 3), BLACK);

    equal(result.captures.length, 1, "captures array must be only 1 long");
    ok(result.successful, "must be be successful");
    equal(result.captures[0].toString(), otre.util.point(1,2).toString(),
        "must have captured the white stone");
  });
};
