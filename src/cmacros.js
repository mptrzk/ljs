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


[
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
  'instanceof',
].map(op => {
  cmacros.set(op, (...args) => {
    let eargs = args.map(compile);
    //if (first === undefined) return 0; //TODO for mul it's wrong!
    //remove?
    //return '(' + first + rest.map(x => ' '+ op +' ' + x).join('') + ')';
    return '(' + eargs.join(' '+op+' ') + ')';
  }); //^^ TODO use `${...}`?
});

cmacros.set('++', (arg) => {
  return `${compile(arg)}++`;
});


toStatements = (arr) => arr.map(x => x+';').join('\n');

cmacros.set('imp', (...args) => {
  return `(() => {
    ${toStatements(args.map(compile))}
  })()`;
});


cmacros.set('for', (...args) => {
  let [clause, ...body] = args;
  let [ival, condt, incr] = clause.map(compile);
  body = body.map(compile);
  return `for (${ival}; ${condt}; ${incr}) {
    ${toStatements(body)}
  }`
});

cmacros.set('blk', (...args) => {
  return `{${toStatements(args.map(compile))}}`;
})

cmacros.set('fn', (args, body) => {
  return `(${args.join(', ')}) => ${compile(body)}`;
})
//TODO destructuring



//do I want implicit progn?
//  l8r
//  check how many args you get
//  do the implicit progn if more than 1 body args 
//  how about documentation string
//    do that as well
//    but first make something that works

