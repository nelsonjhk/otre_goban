// Otre: A Go Studying Program
// Copyright (c) 2012, Josh <jrhoak@gmail.com>
// Code licensed under the MIT License
otre.enums = {
  // Also sometimes referred to as colors. See util.colors.
  states: {
    BLACK: "_bstate",
    WHITE: "_wstate",
    EMPTY: "_emptystate"
  },

  problemActions: {
    CORRECT: "Correct",
    INCORRECT: "Incorrect"
  },

  displayTypes: {
    SIMPLE_BOARD: 1,
    EXPLAIN_BOARD: 2
  },

  directions: {
    LEFT: 1,
    RIGHT: 2,
    TOP: 3,
    BOTTOM: 4,
  }
  
  // The directions should work with the boardRegions.
  boardRegions: {
    LEFT: 1,
    RIGHT: 2,
    TOP: 3,
    BOTTOM: 4,
    TOP_LEFT: 5,
    TOP_RIGHT: 6,
    BOTTOM_LEFT: 7,
    BOTTOM_RIGHT: 8,
    ALL: 9;
  }
};
var enums = otre.enums;
