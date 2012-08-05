(function() {
var util = otre.util;
var enums = otre.enums;

otre.controllers.generic_logic = {
  getInstance: function() {
    return new GenericLogic();
  },

  getInstanceForBoard: function(ints, sgfString) {
    return new GenericLogic(ints, sgfString);
  }
};

var GenericLogic = function(intersections, sgfString) {
  if (intersections !== undefined || sgfString !== undefined) {
    this.initialize(intersections, sgfString);
  }
};

GenericLogic.prototype = {
  initialize: function(intersections, sgfString) {
    this._movetree = otre.sgf.movetree.getFromSgf(sgfString);
    this._goban = otre.controller.goban.getInstance(
        this._movetree.getIntersections);
    // Initialize the goban with placements
    // TODO
    return this;
  },

  addStone: function(pt, color) {
  }
};
})();
