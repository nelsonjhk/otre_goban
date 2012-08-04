otre.rules.generic_logic_test = function() {
  var rules = otre.rules;
  var sgfs = testdata.sgfs;
  var util = otre.util;

  test("--------Generic Logic Test--------", function() { ok(true); });

  test("Successful Generic Logic Initialize", function() {
    var genlog = otre.rules.generic_logic.getInstance();
    genlog.initialize(19, sgfs.veryeasy);
    ok(genlog._movetree !== undefined, 
        "must be successful in initializing the goban");
    ok(genlog._movetree !== undefined, 
        "must be successful in initializing the movetree");
  });
};
