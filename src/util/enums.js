// Otre: A Go Studying Program
// Copyright (c) 2012, Josh <jrhoak@gmail.com>
// Code licensed under the MIT License
(function() {

// <otre_lib>
otre.enums = {
  boardTypes: {
    PROBLEM: "problem",
    GAME: "game"
  },

  // Also sometimes referred to as colors. See util.colors;
  states: {
    BLACK: "_bstate",
    WHITE: "_wstate",
    EMPTY: "_emptystate"
  },

  oppColorTokenMap: {
    W: "B",
    B: "W"
  },

  problemActions: {
    CORRECT: "Correct",
    INCORRECT: "Incorrect"
  },

  drawTypes: {
    RAPHAEL: "raphael"
  }
};

})();
