// Note, this is not included in the compiled JS file.
if (otre.testdata === undefined) {
  otre.testdata = {};
}

otre.testdata.sgf = {
  easy: 
    "(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]" +
    "RU[Japanese]SZ[19]KM[0.00]" +
    "PW[White]PB[Black]AW[pa][pb][sb][pc][qc][sc][qd][rd][sd]AB[oa][qa][ob][rb][oc][rc][pd][pe][qe][re][se]C[\] Black to Live]" +
    "" +
    "(;B[sa];W[ra]C[Ko])" +
    "(;B[ra]C[Correct];W[]C[And if white thinks it is seki?]" +
    "  (;B[qb]C[Correct.];W[sa];B[rb]C[Black lives])" +
    "  (;B[sa];W[qb];B[ra];W[rb]C[White Lives])" +
    ")" +
    "(;B[qb];W[ra]C[White lives]))"
};

