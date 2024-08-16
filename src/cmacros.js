cmacros = new Map();


quote = (arg) => {
  if (arg instanceof Array) {
    return `[${arg.map(quote).join(', ')}]`;
  }
  return `'${arg}'`;
}
cmacros.set("'", quote);


qquote = (arg) => {
  if (arg instanceof Array) {
    if (arg[0] == ',') return compile(arg[1]);
    if (arg[0] == ',@') {
      return `...${compile(arg[1])}`;
    }
    return `[${arg.map(qquote).join(', ')}]`;
  }
  return `'${arg}'`;
}
cmacros.set("`", qquote);


cmacros.set('[', (...args) => {
  return `[${args.map(compile).join(', ')}]`;
});

objrec = ([k, v]) => {
  return isArray(k)
    ? `[${compile(k[0])}]: ${compile(v)}`
    : `${k}: ${compile(v)}`;
}

cmacros.set('{', (...args) => {
  return `({${args.map(objrec).join(', ')}})`; //adding parens?
});

cmacros.set('@', (arr, ...args) => {
  return compile(arr) + args.map(x => `[${compile(x)}]`).join('');
});




[
  '...',
  'return',
  'yield',
  'throw',
  'new',
  'delete',
  'await',
  'async',
].map(op => {
  cmacros.set(op, (arg) => {
    return `${op} ${compile(arg)}`;
  });
});

[
  'const',
  'let',
  'var',
].map(op => {
  cmacros.set(op, (...args) => {
    let ret = `${op} ${args[0]}`;
    if (args.length == 2) ret += ` = ${compile(args[1])}`;
    //TODO error handling
    return ret;
  });
});
//TODO destructuring

binops = [
  '+', '-', '*', '/', '%',
  '&', '|', '^',
  '&&', '||', '??',
];

//TODO destructuring in case of "="
//  turning it walrus?
[
  ...binops,
  ...binops.map(x => x + '='),
  '=', '==', '===',
  '!=', '!==',
  '<', '>', '<=', '>=',
  '.', 'instanceof',
].map(op => {
  cmacros.set(op, (...args) => {
    let eargs = args.map(compile);
    //if (first === undefined) return 0; //TODO for mul it's wrong!
    //remove?
    //return '(' + first + rest.map(x => ' '+ op +' ' + x).join('') + ')';
    return `(${eargs.join(` ${op} `)})`;
  })
});

cmacros.set('++', (arg) => {
  return `${compile(arg)}++`;
});
cmacros.set('--', (arg) => {
  return `${compile(arg)}--`;
});

cmacros.set('?', (cond, expr1, expr2) => {
  expr2 ??= null;
  return `(${cond}) ? (${expr1}) : (${expr2})`;
});
//TODO test


toStatements = (arr) => arr.map(x => x+';').join('\n');

cmacros.set('imp', (...args) => {
  return `(() => {
    ${toStatements(args.map(compile))}
  })()`;
});

cmacros.set('blk', (...args) => {
  return `{${toStatements(args.map(compile))}}`;
})

cmacros.set('for', (...args) => {
  let [clause, ...body] = args;
  let [ival, condt, incr] = clause.map(compile);
  body = body.map(compile);
  return `for (${ival}; ${condt}; ${incr}) {
    ${toStatements(body)}
  }`
});


objrecArg = (arg) => {
  if (isArray(arg)) {
    let [k, v] = arg;
    return isArray(k)
      ? `[${compile(k[0])}]: ${compileArg(v)}`
      : `${k}: ${compileArg(v)}`;
  }
  return arg;
}

compileArg = x => {
  if (isArray(x)) {
    let [op, ...args] = x;
    //map args with compileArg?
    if (op == '...') return `...${compileArg(args[0])}`;
    if (op == '=') { //special case for destructuring?
      return `${compileArg(args[0])}=${compile(args[1])}`
    }
    if (op == '[') {
      return `[${args.map(compileArg).join(', ')}]`;
    }
    if (op == '{') {
      return `{${args.map(objrecArg).join(', ')}}`;
    }
  }
  return x;
}
//but this should also be used for destructuring assingment...
//  how about simplifying it?

cmacros.set('fn', (args, body) => {
  return `(${args.map(compileArg).join(', ')}) => 
            ${compile(body)}
  `;
})
//TODO destructuring



//do I want implicit progn?
//  l8r
//  check how many args you get
//  do the implicit progn if more than 1 body args 
//  how about documentation string
//    do that as well
//    but first make something that works

