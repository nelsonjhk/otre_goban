otre.display = {
  initialize: function(logic, divName) {},
};

var Display = function(logic, divName) {
  this.guiFactory = otre.display.guiFactory(logic, divName);
};

var GuiFactory = function(divName) {
  this.env = otre.display.getEnvironment(divName, logic)
  //this.paper = ...;
};

GuiFactory.prototype = {
  initializeEnvironment: function() {
    this.env.initialize();   
  }
};
