(function() {
var util = otre.util;
 
otre.util_test = function() {
  test("typeOf test", function() { 
    equal(util.typeOf({}), "object", "expect object");
  });

  test("inbounds", function() {
    ok(util.inBounds(5, 19), "inbounds: 5 on 19");
  });
};


})();
