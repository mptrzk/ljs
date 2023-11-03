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
    if (!isArray(el)) return [el];
    if (el[0] == ',') return [subs.shift()];
    if (el[0] == ',@') return subs.shift();
    return [qqsub(el, subs)];
  }));
}

cmacros.set('`', (qb, arg) => {
  //let q = cmacros.get("'")(qb, arg);
  let qi = qb.length;
  qb.push(arg);
  a = qqextract(arg).map(x => yeet(qb, x));
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
    return `${op} ${yeet(qb, arg)}`;
  });
});

[
  'const',
  'let',
  'var',
].map(op => {
  cmacros.set(op, (qb, ...args) => {
    let ret = `${op} ${args[0]}`;
    if (args.length == 2) ret += ` = ${yeet(qb, args[1])}`;
    //TODO error handling
    return ret;
  });
});

alops = [
  '+', '-', '*', '/', '%',
  '&', '|', '^',
  '&&', '||', '??',
];

[
  ...alops,
  ...alops.map(x => x + '='),
  '=', '==', '===',
  '!=', '!==',
  '<', '>', '<=', '>=',
].map(op => {
  cmacros.set(op, (qb, ...args) => {
    let eargs = args.map(x => yeet(qb, x));
    //if (first === undefined) return 0; //TODO for mul it's wrong!
    //remove?
    //return '(' + first + rest.map(x => ' '+ op +' ' + x).join('') + ')';
    return '(' + eargs.join(' '+op+' ') + ')';
  }); //^^ TODO use `${...}`?
});

cmacros.set('++', (qb, arg) => {
  return `${yeet(qb, arg)}++`;
});


toStatements = (arr) => arr.map(x => x+';').join('\n');

cmacros.set('imp', (qb, ...args) => {
  return `(() => {
    ${toStatements(args.map(x => yeet(qb, x)))}
  })()`;
});


cmacros.set('for', (qb, ...args) => {
  let [clause, ...body] = args;
  let [ival, condt, incr] = clause.map(x => yeet(qb, x));
  body = body.map(x => yeet(qb, x));
  return `for (${ival}; ${condt}; ${incr}) {
    ${toStatements(body)}
  }`
});
