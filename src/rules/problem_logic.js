(function() {
var util = otre.util;
var enums = otre.enums;

// <otre_lib>
(function() {
otre.rules.problem_logic = {
  getInstance: function() {
    return new ProblemLogic();
  }
}

// The Logic pieces are the connection pieces between the display and and the
// rules. 
//
// The ProblemLogic contains the problem logic
var ProblemLogic = function() {

};

ProblemLogic.prototype = {
  initializeFromSgf: function(sgfString) {},
  addStone: function(point, color) {},
  
};

})();
// </otre_lib>

})();
