cmacros = new Map();

cmacros.set("'", (qb, arg) => {
  let qi = qb.length;
  qb.push(arg);
  return `__quotes[${qi}]`;
});


qqextractRec = (expr, lst) => {
  expr.map(el => {
    if (!isArray(el)) return;
    if (el[0] == ',' || el[0] == ',@') {
      lst.push(el[1]);
      return;
    }
    qqextractRec(el, lst);
  });
}

qqextract = expr => {
  let lst = [];
  qqextractRec(expr, lst);
  return lst;
}
//^^ without rec, using concat or something?
//sounds slower

qqsub = (expr, subs) => {
  return concat(...expr.map(el => { 
    //^^ why this concat? a workaround around ,@?
    if (!isArray(el)) return [el];
    if (el[0] == ',') return [subs.shift()]; //how about atoms?
    if (el[0] == ',@') return subs.shift();
    return [qqsub(el, subs)];
  }));
}

cmacros.set('`', (qb, arg) => { //TODO what is this code doing?
  //let q = cmacros.get("'")(qb, arg);
  let qi = qb.length;
  qb.push(arg);
  try {
    a = qqextract(arg).map(x => compile(qb, x)); //better name
  } catch(e) {
    console.error("it's useless to quasiquote an atom");
  }
  return `qqsub(__quotes[${qi}], [${a.toString()}])`;
});

[
  'return',
  'yield',
  'throw',
  'new',
  'delete',
  'await',
  'async',
].map(op => {
  cmacros.set(op, (qb, arg) => {
    return `${op} ${compile(qb, arg)}`;
  });
});

[
  'const',
  'let',
  'var',
].map(op => {
  cmacros.set(op, (qb, ...args) => {
    let ret = `${op} ${args[0]}`;
    if (args.length == 2) ret += ` = ${compile(qb, args[1])}`;
    //TODO error handling
    return ret;
  });
});

binops = [
  '+', '-', '*', '/', '%',
  '&', '|', '^',
  '&&', '||', '??',
];

[
  ...binops,
  ...binops.map(x => x + '='),
  '=', '==', '===',
  '!=', '!==',
  '<', '>', '<=', '>=',
  'instanceof',
].map(op => {
  cmacros.set(op, (qb, ...args) => {
    let eargs = args.map(x => compile(qb, x));
    //if (first === undefined) return 0; //TODO for mul it's wrong!
    //remove?
    //return '(' + first + rest.map(x => ' '+ op +' ' + x).join('') + ')';
    return '(' + eargs.join(' '+op+' ') + ')';
  }); //^^ TODO use `${...}`?
});

cmacros.set('++', (qb, arg) => {
  return `${compile(qb, arg)}++`;
});


toStatements = (arr) => arr.map(x => x+';').join('\n');

cmacros.set('imp', (qb, ...args) => {
  return `(() => {
    ${toStatements(args.map(x => compile(qb, x)))}
  })()`;
});


cmacros.set('for', (qb, ...args) => {
  let [clause, ...body] = args;
  let [ival, condt, incr] = clause.map(x => compile(qb, x));
  body = body.map(x => compile(qb, x));
  return `for (${ival}; ${condt}; ${incr}) {
    ${toStatements(body)}
  }`
});
