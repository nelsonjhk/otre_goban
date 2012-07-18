(function() {
var util = otre.util;
var enums = otre.enums;

// <otre_lib>
(function() {
/*
 * When an SGF is parsed by the parser, it is transformed into the following:
 *
 * {
 *  data: {
 *    AW: [...],
 *    AB: [...],
 *    KM: [...],
 *  },
 *  moves: [
 *    {
 *      data: { B: [...], C: [...] },
 *      moves: [...],
 *    },
 *    {
 *      data: { B: [...], C: [...] },
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
    return new MoveTree(otre.sgf.parser.parse($.trim(sgfString)));
  },

  _createNewMove: function() {
    return { tokens: {}, moves: [] };
  },

  // SGFs are indexed from the Upper Left:
  //  _  _  _ 
  // |aa ba ca ...
  // |ab bb
  // |.
  // |.
  // |.
  sgfCoordToPoint: function(coord) {
    return new util.Point(coord.charCodeAt(0) - 97, coord.charCodeAt(1) - 97);
  },

  pointToSgfCoord: function(coord) {
    return String.fromCharCode(coord.x +  97) + 
        String.fromCharCode(coord.y + 97)
  }
};

// A MoveTree is a history (a tree) of the past moves played.  The movetree is
// (usually) a processed parsed SGF, but could be created organically.
//
// The tree itself is tree structure made out of MoveNodes.
var MoveTree = function(parsedSgf) {
  // This could be called the 'rootMove'.
  this._parsedSgf = parsedSgf;

  // The moveHistory serves two purposes -- it allows travel backwards (i.e.,
  // up the tree), and it gives the current move, which is the last move in the
  // array.
  this._moveHistory = []
  this._moveHistory.push(this._parsedSgf);
};

MoveTree.prototype = {
  getCurrentMove: function() {
    return this._moveHistory[this._moveHistory.length - 1];
  },

  getCurrentProps: function() { 
    return this.getCurrentMove()['data'];
  },

  // Return the value of a property, if it exists.
  // Otherwise, return None
  getCurrentProp: function(strProp) {
    if (otre.sgf.allProps[strProp] === undefined) {
      util.debugl("attempted to retrieve a property that is not part" 
           + " of the SGF Spec: " + strProp);
      return util.none;
    }
    var curProps = this.getCurrentProps();
    if (curProps !== undefined && curProps[strProp] !== undefined) {
      return curProps[strProp];
    } else { 
      util.debugl("no property: " + strProp + " exists for the current move");
      return util.none; 
    }
  },

  addProperty: function(strProp) { 
    
  },

  //TODO
  addMove: function(color, point) {},

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
