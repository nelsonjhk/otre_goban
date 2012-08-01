(function() {
var util = otre.util;
var enums = otre.enums;

// <otre_lib>
(function() {
otre.rules.problem_logic = {
  getInstance: function() {
    return new ProblemLogic(
       
    );
  }
}

// The Logic pieces are the connection pieces between the display and and the
// rules.  Specifically, the ProblemLogic contains the logic involved with doing
// problems.
//
// Structurally, it looks like:
//
// ProblemLogic: 
//    - Goban
//    - MoveTree
//
// However, the MoveTree can be initialed / renitialized later. 
var ProblemLogic = function(goban, sgf) {
  this.goban = goban;
};

ProblemLogic.prototype = {
  initializeFromSgf: function(sgfString) {},
  addStone: function(point, color) {},
};

})();
// </otre_lib>

})();
