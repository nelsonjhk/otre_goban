(function() {
var util = otre.util;
var enums = otre.enums;

// <otre_lib>
(function() {
/*
 * When an SGF is parsed by the parser, it is transformed into the following:
 *
 * {
 *  tokens: {
 *    AW: [...],
 *    AB: [...],
 *    KM: [...],
 *  },
 *  moves: [
 *    {
 *      tokens: { B: [...], C: [...] },
 *      moves: [...],
 *    },
 *    {
 *      tokens: { B: [...], C: [...] },
 *      moves: [...],
 *    }
 *  ]
 * }
 *
 * Thus, each move is an object with two properties: tokens and moves, the
 * latter of which is a list to capture the idea of multiple variations.
 *
 * The MoveTree is a simple wrapper around the parsed SGF.
 */
otre.rules.movetree = {
  // Create an empty MoveTree
  getInstance: function() {
    return new MoveTree(new MoveNode());
  },

  // Create a MoveTree from an SGF.
  getFromSgfString: function(sgfString) {
    return new MoveTree(
      otre.sgf.parser.parse($.trim(sgfString)));
  }
};

// A MoveTree is a history (a tree) of the past moves played.
// The movetree is (usually) a processed parsed SGF.
//
// The tree itself is tree structure made out of MoveNodes.
var MoveTree = function(parsedSgf) {
  // This could be called the 'rootMove'.
  this.parsedSgf = parsedSgf;
  this.moveHistory = [];
};

MoveTree.prototype = function() {
  //TODO
  addMove: function() {},
  //TODO
  deleteCurrentMove: function() {},
  //TODO
  moveDown: function(variationNum) {},
  //TODO
  moveUp: function() {}
};

})();
// </otre_lib>

})();
