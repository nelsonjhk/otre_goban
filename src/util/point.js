(function() {
// Might consider being smarter and caching points.
otre.util.point = function(x,y) {
  return new OtrePoint(x,y);
};

// Private Point Class
var OtrePoint = function(x, y) {
  this.x = x;
  this.y = y;
};

OtrePoint.prototype = {
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
})();
