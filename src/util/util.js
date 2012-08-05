(function() {
var enums = otre.enums;

// <otre_lib>
// A utility method -- for prototypal inheritence.
if (typeof Object.beget !== 'function') {
  Object.beget = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}

otre.util = {
  logz: function(msg) {
    var modmsg = msg;
    if (otre.util.typeOf(msg) === "array" ||
        otre.util.typeOf(msg) === "object") {
      modmsg = JSON.stringify(msg);
    }
    console.log("" + modmsg);
  },

  // Via Crockford / StackOverflow: Determine the type of a value in robust way.
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

  // Array utility functions
  // is_array is Taken from JavaScript: The Good Parts
  isArray: function (value) {
    return value && typeof value === 'object' && value.constructor === Array;
  },

  // Checks to make sure a number is inbounds
  inBounds: function(num, bounds) {
    return ((num < bounds) && (num >= 0));
  },

  // Checks to make sure a number is out-of-bounds
  // returns true if a number is outside a bounds (inclusive) or negative
  outBounds: function(num, bounds) {
    return ((num >= bounds) || (num < 0));
  }
};
var util = otre.util;

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

(function () {
// Private None Class
var None = function() {}
None.prototype = {
  toString: function() {
    return "None";
  }
};

// We only need to create one instance of None.
otre.util.none = new None();
})();
// </otre_lib>

})();

