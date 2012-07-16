var movetree = otre.sgf.movetree;
var sgfs = testdata.sgfs;

otre.sgf.movetree_test = function() {
  test("that parsing works", function() {
    movetree.getFromSgf(sgfs.veryeasy)
    ok(true, "shouldn't throw an exception");
  });
};
