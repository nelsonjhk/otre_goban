/*
 * Peg grammar for SGF files
 */
Start = '(;' tokens:Tokens pmoves:Variations ')' {
  return { props: tokens, nodes: pmoves };
}

Variations =  '(' var1:Moves ')' white:WhiteSpace? '(' var2:Moves ')' white:WhiteSpace? more:MoreVars { return [var1, var2].concat(more); }
    /  move:Moves { return (move === undefined ? [] : [move]); }

MoreVars = '(' move:Moves ')' white:WhiteSpace? more:MoreVars { return [move].concat(more); }
    / '' { return []; }

Moves = ';' tokens:Tokens variations:Variations {
          return { props: tokens, nodes: variations };
        }
    / '' { return undefined; }

Tokens = token: TokenName '[' props: Data ']' white:WhiteSpace? more:MoreData white:WhiteSpace? tokens:MoreTokens {
  tokens[token] = [props].concat(more);
  return tokens;
}

MoreTokens = Tokens
    / '' { return {}; }

Data = props:(( '\\]' / [^\]])*) { 
  return props.join(""); 
}

MoreData = '[' props: Data ']' white:WhiteSpace? more: MoreData { return [props].concat(more); }
    / '' { return []; }

TokenName = name:([a-zA-Z] [a-zA-Z] / [a-zA-Z]) {
  if (name.length === 1) return name[0];
  else return name.join("").toUpperCase();
}

WhiteSpace = (" " / '\n')*
