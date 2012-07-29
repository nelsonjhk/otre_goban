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
    return new MoveTree(this._createRootNode());
  },

  // Create a MoveTree from an SGF.
  getFromSgf: function(sgfString) {

    // Before we give back the tree, we number the nodes, with both the
    // variation number and move number.  Without these, there is no good way to
    // uniquely identify a node, beyond the object reference.
    return new MoveTree(
        this._numberMoves(
            otre.sgf.parser.parse($.trim(sgfString)), 
            0, /* moveNum */
            0 /* varNum */));
  },

  getFromNode: function(node) {
    return new MoveTree(node);
  },

  _createRootNode: function() {
    var nodeId = this.createNodeId(0, 0);
    return { nodeId: nodeId, data: {}, moves: [] };
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
  },

  // Seach nodes with a Depth First Search. We rely on closure variables to
  // capture the result of the recursion.
  _searchMoveTreeDFS: function(moveTree, func) {
    func(moveTree);
    for (var i = 0; i < moveTree.getNextMovesLength(); i++) {
      otre.sgf.movetree._searchNodesDFS(moveTree.moveDown(i), func);
    }
    moveTree.moveUp();
  },

  // This adds NodeIds to an incoming parsed SGF.
  _numberMoves: function(move, moveNum, varNum) {
    move.nodeId = this.createNodeId(moveNum, varNum);
    for (var i = 0; i < move.moves.length; i++) {
      var next = move.moves[i];
      this._numberMoves(next, moveNum + 1, i);
    }
    return move;
  },

  // Create a simple object to keep track of the move number and the
  // variation number for a node in the moveTree.
  createNodeId: function(moveNum, varNum) {
    return { moveNum: moveNum, varNum: varNum };
  }
};

// A MoveTree is a history (a tree) of the past moves played.  The movetree is
// (usually) a processed parsed SGF, but could be created organically.
//
// The tree itself is tree structure made out of MoveNodes.
var MoveTree = function(parsedSgf) {
  // The moveHistory serves two purposes -- it allows travel backwards (i.e.,
  // up the tree), and it gives the current move, which is the last move in the
  // array.
  this._moveHistory = []
  this._moveHistory.push(parsedSgf);
};

MoveTree.prototype = {
  getRoot: function() {
    return this.moveHistory[0];
  },

  getCurrentMove: function() {
    return this._moveHistory[this._moveHistory.length - 1];
  },

  getAllNextMoves: function() {
    return this.getCurrentMove().moves;
  },

  getNextMovesLength: function() {
    return this.getAllNextMoves().length;
  },

  // Get a particular next move.
  // num can be undefined, for convenience.
  getNextMove: function(num) {
    if (num === undefined) {
      return this.getAllNextMoves()[0];
    } else {
      return this.getAllNextMoves()[num];
    }
  },

  getCurrentMoveNum: function() {
    return this.getCurrentMove().nodeId.moveNum;
  },

  // Get the current variation number. This is not necessary, but extremely
  // convenient for moving / deleting move nodes.
  getCurrentVarNum: function() {
    return this.getCurrentMove().nodeId.varNum;
  },

  getCurrentNodeId: function() {
    return this.getCurrentMove().nodeId;
  },

  getAllCurrentProps: function() {
    return this.getCurrentMove().data;
  },

  // Return the value of a property, if it exists.
  // Otherwise, return None
  getCurrentProp: function(strProp) {
    if (otre.sgf.allProps[strProp] === undefined) {
      util.debugl("attempted to retrieve a property that is not part"
           + " of the SGF Spec: " + strProp);
      return util.none;
    }
    var curProps = this.getAllCurrentProps();
    if (curProps !== undefined && curProps[strProp] !== undefined) {
      return curProps[strProp];
    } else {
      util.debugl("no property: " + strProp + " exists for the current move");
      return util.none;
    }
  },

  hasProp: function(prop) {
    return this.getCurrentProp(prop) !== util.none;
  },

  // Delete the prop and return the value.
  deleteProp: function(prop) {
    if (this.hasProp(prop)) {
      var value = this.getCurrentProp(prop);
      delete this.getAllCurrentProps()[prop];
      return value;
    }
  },

  // Add an SGF Property to the current move. Return the MoveTree, for
  // convenience, so that you can chain addProp calls.
  //
  // Eventually, each sgf property should be matched to a datatype.  For now,
  // the user is allowed to put arbitrary data into a property.
  //
  // Note that this does not overwrite an existing property - for that, the user
  // has to delet the existing property.
  addProp: function(prop, value) {
    // Return if the property already exists, and do nothing.
    if (this.hasProp(prop)) return this; 
    // Return if the property is not a real property.
    if (otre.sgf.allProps[prop] === undefined) return this;
    // Else add the property.
    this.getAllCurrentProps()[prop] = value;
    return this;
  },

  // Move down, but only if there is an available variation
  // variationNum can be undefined for convenicence.
  moveDown: function(variationNum) {
    var num = variationNum === undefined ? 0 : variationNum;
    (this.getNextMove(num) !== undefined) &&
        this._moveHistory.push(this.getNextMove(num));
    return this;
  },

  // Move up a move, but only if you are not in the intial (0th) move.
  moveUp: function() {
    if (this._moveHistory.length > 1) {
      this._moveHistory.pop(); 
    }
    return this;
  },

  // Move to the root node
  moveToRoot: function() {
    this._moveHistory = this._moveHistory.slice(0,1);
    return this;
  },

  // Add a 'move' to the current move and set the current move to that move.
  // Recall that a move is an object that looks like:
  //  {
  //    moveNum : <num>,
  //    varNum : <num>,
  //    moves : [...],
  //    data : { .... }
  //  }
  //
  //  Return this for convenience.
  //
  addNewMove: function() {
    var nodeId = otre.sgf.movetree.createNodeId(
        this.getCurrentMoveNum() + 1,
        this.getNextMovesLength());
    this.getAllNextMoves().push(
      {
        nodeId : nodeId,
        moves : [],
        data : {}
      }
    );
    this.moveDown(this.getNextMovesLength() - 1);
    return this;
  },

  recurseNodes: function(func) {
    otre.sgf.movetree._searchMoveTreeDFS(this, func);
  },

  recurseFromStart: function(func) {
    otre.sgf.movetree._searchNodesDFS(
        otre.sgf.movetree.getFromNode(this.getRoot()), func);
  },

  //TODO
  deleteCurrentMove: function() {},

  toSgf: function() {},
  
  recurse: function(func) {
    otre.sgf.movetree._searchNodesDFS(func, this.getCurrentMove());
  },

  // return an array of NodeIds
  searchForProps: function(prop) {
    var out = [];
  }
};

})();
// </otre_lib>

})();
