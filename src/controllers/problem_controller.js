(function() {
var util = otre.util;
var enums = otre.enums;

otre.controllers.problem_controller = {
  getInstance: function() {
    return new ProblemController();
  }
};

// The Logic pieces are the connection pieces between the display and and the
// rules.  The ProblemController contains the logic involved with doing
// problems.
//
// Structurally, it looks like:
//
// ProblemController: 
//    - Goban
//    - MoveTree
//
// However, the MoveTree can be initialized / reinitialized later. 
var ProblemController = function(intersections, sgf) {
};

ProblemController.prototype = {
  initializeFromSgf: function(sgfString) {},
  addStone: function(point, color) {},
};

})();
