otre.display = {
  initialize: function(logic, divName) {},
};

var Display = function(logic, divName) {
  // The logical-communicator.
  this.guiFactory = otre.display.guiFactory(logic, divName);
};

var GuiFactory = function(divName) {
  this.env = otre.display.getEnvironment(divName, logic)
  this.paper = ...;
};
