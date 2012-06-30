(function() {

var util = otre.util;
var log = otre.logger;
var enums = otre.enums;

(function() {
otre.gamestate = {
  getInstanceFromSgf: function(intersections, sgf) {
    return new Gamestate(intersections, sgf);
  }
};

var Gamestate = function(intersections, sgf) {
  this.movetree = otre.getInstanceFromSgf(sgy);
}
