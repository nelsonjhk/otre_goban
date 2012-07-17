(function() {
var enums = otre.enums;

// <otre_lib>
otre.util = {
  logz: function(msg) {
    var modmsg = msg;
    if (otre.util.typeOf(msg) === "array" ||
        otre.util.typeOf(msg) === "object") {
      modmsg = JSON.stringify(msg);
    }
    console.log("" + modmsg);
  },

  // returns true if a number is inside a bounds (non-inclusive) and not
  // negative
  notDefined: function(msg) {
    var error = "Function not defined";
    if (msg) error += ": " + msg;
    throw error;
  },

  // Via Crockford / StackOverflow:
  typeOf: function(value) {
    var s = typeof value;
    if (s === 'object') {
      if (value) {
        if (value instanceof Array) {
          s = 'array';
        }
      } else {
        s = 'null';
      }
    }
    return s;
  },

  checkDefined: function(x, msg) {
    if (!x) {
      if (msg) {
        throw new Error(msg);
      } else {
        throw new Error("Paramter not defined.");
      }
    }
    return x;
  },

  // Checks to make sure a number is inbounds
  inBounds: function(num, bounds) {
    return ((num < bounds) && (num >= 0));
  },

  // Checks to make sure a number is out-of-bounds
  // returns true if a number is outside a bounds (inclusive) or negative
  outBounds: function(num, bounds) {
    return ((num >= bounds) || (num < 0));
  },

  // Array utility functions
  // is_array is Taken from JavaScript: The Good Parts
  is_array: function (value) {
    return value && typeof value === 'object' && value.constructor === Array;
  },

  searchRemove: function(item, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].toString() === item.toString()) {
        array.splice(i, 1);
      }
    }
  },

  searchRemovePts: function(pt, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].toString() === pt.toString()) {
        array.splice(i, 1);
      }
    }
  },

  existsIn: function(item, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].toString() == item.toString()) {
        return i;
      }
    }
    return -1;
  },

  uniqueElements: function(ptArray) {
    ptArray.sort();
    var cur = ptArray[0];
    for (var i = 1; i < ptArray.length; i++) {
      var next = ptArray[i];
      if (cur.toString() === next.toString()) {
        ptArray.splice(i, 1);
      }
      cur = next;
    }
    return ptArray;
  },

  uniqueNums: function(numArray) {
    numArray.sort();
    var cur = numArray[0];
    for (var i = 1; i < numArray.length; i++) {
      var next = numArray[i];
      if (cur === next) {
        numArray.splice(i, 1);
      }
      cur = next;
    }
    return numArray;
  },

  uniqueGroupsFromStones: function(stoneArray) {
    var groupIndices = [];
    for (var i = 0; i < stoneArray.length; i++) {
      var index = stoneArray[i].groupIndex;
      if (existsIn(index, groupIndices) === -1) {
        groupIndices.push(index);
      }
    }
    return groupIndices;
  }
};
var util = otre.util;

otre.util.colors = {
  isLegalColor: function(color) {
    return color === enums.states.BLACK ||
        color === enums.states.WHITE ||
        color === enums.states.EMPTY;
  },

  oppositeColor: function(color) {
    if (color === enums.states.BLACK) return enums.states.WHITE;
    if (color === enums.states.WHITE) return enums.states.BLACK;
    else return color;
  }
}

otre.math = {
  abs: function(num) {
    if (num >= 0) return num;
    else return num * -1;
  },
  max: function(num1, num2) {
    if (num1 > num2) return num1;
    else return num2;
  },
  min: function(num1, num2) {
    if (num1 > num2) return num2;
    else return num1;
  },
  isEven: function(num1) {
    if ((num1 % 2) == 0) return true;
    else return false;
  }
};

// Point data structure
otre.util.point = function(x,y) {
  return new otre.util.Point(x,y);
}

otre.util.Point = function(x, y) {
  this.x = x;
  this.y = y;
};

otre.util.Point.prototype = {
  toString:  function() {
    return this.x + "," + this.y;
  },

  // We offset by 1 because 0,0 is a legal point.
  hash: function() {
    return 100 * (this.x + 1) + (this.y + 1)
  },

  value: function() {
    return this.toString();
  },

  equals: function(point) {
    return this.x === point.x && this.y === point.y;
  },

  toSgfCoord: function() {
    return String.fromCharCode(this.x + 97) + String.fromCharCode(this.y + 97);
  }
};


otre.util.pointFromString = function(str) {
  try {
    var split = str.split(",");
    var x = parseInt(split[0]);
    var y = parseInt(split[1]);
    return new otre.util.Point(x, y);
  } catch(e) {
    throw "Parsing Error! Couldn't parse a point from: " + str;
  }
};

otre.util.pointFromHash = function(int) {
  if (typeof(int) != "number" && typeof(int) != "string") {
    throw "Parsing error. int required, but found: " + int +
        "\nTypof: " + typeof(int);
  }
  if (typeof(int) == "string") {
    int = parseInt(int);
  }
  return otre.util.point((int / 100 << 0) - 1, (int % 100) - 1);
};

// A better logging solution.
otre.util.debugl = function(msg) {
  if (otre.debugOn) {
    var modmsg = msg;
    if (otre.util.typeOf(msg) === "array" ||
        otre.util.typeOf(msg) === "object") {
      modmsg = JSON.stringify(msg);
    }
    console.log(msg);
  }
};

var None = function() {}
None.prototype = {
  toString: function() {
    return "None";
  }
};

otre.util.none = new None();


// </otre_lib>

})();

