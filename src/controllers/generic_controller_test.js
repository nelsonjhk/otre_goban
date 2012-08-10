otre.controllers.generic_controller_test = function() {
  var cont = otre.controllers;
  var sgfs = testdata.sgfs;

  test("--------Generic Controller Test--------", 
      function() { ok(true); });

  test("Successful Generic Controller Initialize", function() {
    var gen_cont = cont.generic_controller.getInstance();
    gen_cont.initialize(19, sgfs.veryeasy);
    ok(gen_cont._movetree !== undefined, 
        "must be successful in initializing the goban");
    ok(gen_cont._movetree !== undefined, 
        "must be successful in initializing the movetree");
  });
};
