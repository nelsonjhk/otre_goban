/*
 * Peg grammar for SGF files
 */
Start = '(;' tokens:Tokens pmoves:Variations ')' {
  return { data: tokens, moves: pmoves };
}

Variations =  '(' var1:Moves ')' white:WhiteSpace? '(' var2:Moves ')' white:WhiteSpace? more:MoreVars { return [var1, var2].concat(more); }
    /  move:Moves { return (move === undefined ? [] : [move]); }

MoreVars = '(' move:Moves ')' white:WhiteSpace? more:MoreVars { return [move].concat(more); }
    / '' { return []; }

Moves = ';' tokens:Tokens variations:Variations {
          return { data: tokens, moves: variations };
        }
    / '' { return undefined; }

Tokens = token: TokenName '[' data: Data ']' white:WhiteSpace? more:MoreData white:WhiteSpace? tokens:MoreTokens {
  tokens[token] = [data].concat(more);
  return tokens;
}

MoreTokens = Tokens
    / '' { return {}; }

Data = data:(( '\\]' / [^\]])*) { 
  return data.join(""); 
}

MoreData = '[' data: Data ']' white:WhiteSpace? more: MoreData { return [data].concat(more); }
    / '' { return []; }

TokenName = name:([a-zA-Z] [a-zA-Z] / [a-zA-Z]) {
  if (name.length === 1) return name[0];
  else return name.join("").toUpperCase();
}

WhiteSpace = (" " / '\n')*
