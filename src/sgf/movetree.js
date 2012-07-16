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
 * If you are familiar with the SGF format, this should look very similar to the
 * actual SGF format, and is easily converten back to a SGF. And so, The
 * MoveTree is a simple wrapper around the parsed SGF.
 *
 * Each move is an object with two properties: tokens and moves, the
 * latter of which is a list to capture the idea of multiple variations.
 */
otre.sgf.movetree = {
  // Create an empty MoveTree
  getInstance: function() {
    return new MoveTree(this._createNewMove());
  },

  // Create a MoveTree from an SGF.
  getFromSgf: function(sgfString) {
    console.log(sgfString);
    return new MoveTree(otre.sgf.parser.parse($.trim(sgfString)));
  },

  _createNewMove: function() {
    return { tokens: {}, moves: [] };
  }
};

// A MoveTree is a history (a tree) of the past moves played.
// The movetree is (usually) a processed parsed SGF, but could 
//
// The tree itself is tree structure made out of MoveNodes.
var MoveTree = function(parsedSgf) {
  // This could be called the 'rootMove'.
  this._parsedSgf = parsedSgf;

  // The moveHistory serves two purposes -- it allows travel backwards (i.e.,
  // up the tree), and it gives the current move, which is the last move in the
  // array.
  this._moveHistory = ([]).push(this._parsedSgf);
};

MoveTree.prototype = {
  getCurrentMove: function() {
    return this._moveHistory[this._moveHistory.length - 1];
  },

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
