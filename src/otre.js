// Otre: A Go Studying Program
// Copyright (c) 2011, Josh <jrhoak@gmail.com>
// Code licensed under the MIT License

(function(window) {

// From JQuery: expose Otre to the global object
otre = window.otre || {}

// From JavaScript: The Good Parts, Ch 3.5.  For Prototypal inheritence.
if (typeof Object.beget !== 'function') {
  Object.beget = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}

})(window)
