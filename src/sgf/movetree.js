(function() {
var util = otre.util;
var enums = otre.enums;

// <otre_lib>
(function() {
/*
 * When an SGF is parsed by the parser, it is transformed into the following:
 *
 * {
 *  props: {
 *    AW: [...],
 *    AB: [...],
 *    KM: [...],
 *  },
 *  nodes: [
 *    {
 *      props: { B: [...], C: [...] },
 *      nodes: [...],
 *    },
 *    {
 *      props: { B: [...], C: [...] },
 *      nodes: [...],
 *    }
 *  ]
 * }
 *
 * If you are familiar with the SGF format, this should look very similar to the
 * actual SGF format, and is easily converten back to a SGF. And so, The
 * MoveTree is a simple wrapper around the parsed SGF.
 *
 * Each move is an object with two properties: tokens and nodes, the
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
            0, /* nodeNum */
            0 /* varNum */));
  },

  getFromNode: function(node) {
    return new MoveTree(node);
  },

  _createRootNode: function() {
    var nodeId = this.createNodeId(0, 0);
    return { nodeId: nodeId, props: {}, nodes: [] };
  },

  // SGFs are indexed from the Upper Left:
  //  _  _  _
  // |aa ba ca ...
  // |ab bb
  // |.
  // |.
  // |.
  sgfCoordToPoint: function(coord) {
    return new util.point(coord.charCodeAt(0) - 97, coord.charCodeAt(1) - 97);
  },

  pointToSgfCoord: function(coord) {
    return String.fromCharCode(coord.x +  97) +
        String.fromCharCode(coord.y + 97)
  },

  // Seach nodes with a Depth First Search. We rely on closure variables to
  // capture the result of the recursion.
  _searchMoveTreeDFS: function(moveTree, func) {
    func(moveTree);
    for (var i = 0; i < moveTree.getNumNextNodes(); i++) {
      otre.sgf.movetree._searchMoveTreeDFS(moveTree.moveDown(i), func);
    }
    moveTree.moveUp();
  },

  // This adds NodeIds to an incoming parsed SGF, recursively.
  _numberMoves: function(move, nodeNum, varNum) {
    move.nodeId = this.createNodeId(nodeNum, varNum);
    for (var i = 0; i < move.nodes.length; i++) {
      var next = move.nodes[i];
      this._numberMoves(next, nodeNum + 1, i);
    }
    return move;
  },

  // Create a simple object to keep track of the move number and the
  // variation number for a node in the moveTree.
  createNodeId: function(nodeNum, varNum) {
    return { nodeNum: nodeNum, varNum: varNum };
  }
};

// A MoveTree is a history (a tree) of the past nodes played.  The movetree is
// (usually) a processed parsed SGF, but could be created organically.
//
// The tree itself is tree structure made out of MoveNodes.
var MoveTree = function(parsedSgf) {
  // The moveHistory serves two purposes -- it allows travel backwards (i.e.,
  // up the tree), and it gives the current move, which is the last move in the
  // array.
  this._nodeHistory = [];
  this._nodeHistory.push(parsedSgf);
};

MoveTree.prototype = {
  getRoot: function() {
    return this._nodeHistory[0];
  },

  getNode: function() {
    return this._nodeHistory[this._nodeHistory.length - 1];
  },

  getAllNextNodes: function() {
    return this.getNode().nodes;
  },

  getNumNextNodes: function() {
    return this.getAllNextNodes().length;
  },

  // Get a particular next move.
  // num can be undefined, for convenience.
  getNextNode: function(num) {
    if (num === undefined) {
      return this.getAllNextNodes()[0];
    } else {
      return this.getAllNextNodes()[num];
    }
  },

  getNodeNum: function() {
    return this.getNode().nodeId.nodeNum;
  },

  // Get the current variation number. This is not necessary, but extremely
  // convenient for moving / deleting move nodes.
  getVarNum: function() {
    return this.getNode().nodeId.varNum;
  },

  getNodeId: function() {
    return this.getNode().nodeId;
  },

  getAllProps: function() {
    return this.getNode().props;
  },

  // Return the value of a property, if it exists.  Note that this always
  // returns an array if it does exist.
  // Otherwise, return None
  getProp: function(strProp) {
    if (otre.sgf.allProps[strProp] === undefined) {
      util.debugl("attempted to retrieve a property that is not part"
           + " of the SGF Spec: " + strProp);
      return util.none;
    }
    var curProps = this.getAllProps();
    if (curProps !== undefined && curProps[strProp] !== undefined) {
      return curProps[strProp];
    } else {
      util.debugl("no property: " + strProp + " exists for the current move");
      return util.none;
    }
  },

  // Since the getProp always returns an array, it's sometimes useful to return
  // the first property in the list.  Like getProp, if a property or value can't
  // be found, util.none is returned.
  getFirstProp: function(strProp) {
    var value = this.getProp(strProp);
    if (value !== util.none && value.length >= 1) {
      return value[0]; 
    } else {
      return util.none;
    }
  },

  getPropPoint: function(strProp) {
    var out = this.getProp(strProp);
    if (out !== util.none) {
      return otre.sgf.movetree.sgfCoordToPoint(out); 
    }
  },

  // Get all the placements for a color (BLACK or WHITE).  Return as an array.
  getPlacementsAsPoints: function(color) {
    var prop = "";
    if (color === enums.states.BLACK) {
      prop = otre.sgf.allProps.AB;
    } else if (color === enums.states.WHITE) {
      prop = otre.sgf.allProps.AW;
    }
    
    if (prop === "" || !this.hasProp(prop)) {
      return [];
    }

    return this.getProp(prop);
  },

  // hasProp: Return true if the current move has the property "prop".  Return
  // false otherwise.
  hasProp: function(prop) {
    return this.getProp(prop) !== util.none;
  },

  // Delete the prop and return the value.
  deleteProp: function(prop) {
    if (this.hasProp(prop)) {
      var value = this.getProp(prop);
      delete this.getAllProps()[prop];
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
    this.getAllProps()[prop] = value;
    return this;
  },

  // Move down, but only if there is an available variation
  // variationNum can be undefined for convenicence.
  moveDown: function(variationNum) {
    var num = variationNum === undefined ? 0 : variationNum;
    (this.getNextNode(num) !== undefined) &&
        this._nodeHistory.push(this.getNextNode(num));
    return this;
  },

  // Move up a move, but only if you are not in the intial (0th) move.
  moveUp: function() {
    if (this._nodeHistory.length > 1) {
      this._nodeHistory.pop(); 
    }
    return this;
  },

  // Move to the root node
  moveToRoot: function() {
    this._nodeHistory = this._nodeHistory.slice(0,1);
    return this;
  },

  // Add a 'move' to the current move and set the current move to that move.
  // Recall that a move is an object that looks like:
  //  {
  //    nodeNum : <num>,
  //    varNum : <num>,
  //    nodes : [...],
  //    props : { .... }
  //  }
  //
  //  Return this for convenience.
  //
  addNewNode: function() {
    var nodeId = otre.sgf.movetree.createNodeId(
        this.getNodeNum() + 1,
        this.getNumNextNodes());
    this.getAllNextNodes().push(
      {
        nodeId : nodeId,
        nodes : [],
        props : {}
      }
    );
    this.moveDown(this.getNumNextNodes() - 1);
    return this;
  },

  //TODO
  deleteCurrentNode: function() {},

  recurse: function(func) {
    otre.sgf.movetree._searchMoveTreeDFS(this, func);
  },

  recurseFromRoot: function(func) {
    otre.sgf.movetree._searchMoveTreeDFS(
        otre.sgf.movetree.getFromNode(this.getRoot()), func);
  },

  // TODO (probably will involve the recursion)
  toSgf: function() {
    var out = "";
    for (var propKey in this.getAllProps()) {
    }
  },
};

})();
// </otre_lib>

})();
