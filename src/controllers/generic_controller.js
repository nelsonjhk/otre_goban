(function() {
var util = otre.util;
var enums = otre.enums;

otre.controllers.generic_controller = {
  getInstance: function() {
    return new GenericController();
  },

  getInstanceForBoard: function(ints, sgfString) {
    return new GenericController(ints, sgfString);
  }
};

var GenericController = function(intersections, sgfString) {
  if (intersections !== undefined || sgfString !== undefined) {
    this.initialize(intersections, sgfString);
  }
};

GenericController.prototype = {
  initialize: function(intersections, sgfString) {
    this._movetree = otre.sgf.movetree.getFromSgf(sgfString);
    this._goban = otre.rules.goban.getInstance(
        this._movetree.getIntersections);
    // Initialize the goban with placements
    // TODO
    return this;
  },

  addStone: function(pt, color) {
  }
};
})();
