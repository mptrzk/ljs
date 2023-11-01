document.body.innerHTML = '<h1>Hello, World!</h1>';

l = console.log

f = (a, b) => a + b;

cmacros = new Map();


yeet = (qb, code) => {
  if (Array.isArray(code)) {
    let [op, ...args] = code;
    let m = cmacros.get(op);
    let a = args.map(x => yeet(qb, x));
    if (m === undefined) return `${op}(${a.toString()})`;
    return m(qb, ...args);
  }
  return code;
}

cmpl = code => {
  let qb = [];
  let c = yeet(qb, code);
  return (() => {}).constructor('__quotes', `return ${c};`)(qb);
}


cmacros.set("'", (qb, arg) => {
  let qi = qb.length;
  qb.push(arg);
  return `__quotes[${qi}]`;
});


qqextractRec = (expr, lst) => {
  expr.map(el => {
    if (!listp(el)) return;
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
    if (!listp(el)) return [el];
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
  '+', '-', '*', '/', '%',
  '&', '|', '^',
  '&&', '||', '??',
  '=', '==', '===',
  '!=', '!==',
  '<', '>', '<=', '>=',
]
.map(op => {
  cmacros.set(op, (qb, ...args) => {
    [first, ...rest] = args.map(x => yeet(qb, x));
    if (first === undefined) return 0;
    return '(' + first + rest.map(x => ' '+ op +' ' + x) + ')';
  }); 
});

cmacros.set('++', (qb, arg) => {
  return `${yeet(qb, arg)}++`;
});


toStatements = (arr) => arr.map(x => x+';\n').join('');

cmacros.set('imp', (qb, ...args) => {
  return `(() => {
    ${toStatements(args.map(x => yeet(qb, x)))}
  })()`;
});

cmacros.set('for', (qb, ...args) => {
  let [clause, ...body] = args;
  let [vname, ival, condt, incr] = clause.map(x => yeet(qb, x));
  body = body.map(x => yeet(qb, x));
  return `for (let ${vname}=${ival}; ${condt}; ${incr}) {
    ${toStatements(body)}
  }`
});

car = x => x[0];
cdr = x => x.slice(1);
cons = (x, y) => [x, ...y];
list = (...args) => args;
concat = (...args) => [].concat(...args);
equal = (x, y) => {
  if (typeof(x) == 'object') {
    if (typeof(y) != 'object') return false;
    let kx = Object.keys(x);
    let ky = Object.keys(y);
    if (kx.length != ky.length) return false;
    return (kx.every(k => equal(x[k], y[k])));
  }
  return x === y;
};
numericp = x => !isNaN(x);
listp = Array.isArray;



parseList = str => {
  //try {throw Error();} catch(e) {};
  let lst = [];
  while (str[0] != ')') {
    str = str.trim(); //yeet? move? clean up?
    if (str == '') throw new Error(); //todo make it proper
    let m = str.match(/^:(\S*)(.*)/);
    let key;
    if (m) {
      key = m[1]; 
      str = m[2]; 
    }
    let [first, rest] = parseExpr(str);
    if (!m) lst.push(first);
    else lst[key] = first;
    str = rest; //yeet
  }
  return [lst, str.slice(1)];
}

parseExpr = str => {
  str = str.trim();
  if (str[0] == '(') return parseList(str.slice(1));
  if (str[0] == '"') {
    let match = str.match(/"(.*)"(.*)/);
    return [match[1], match[2]];
  }
  let match = str.match(/([^)\s]+)(.*)/);
  let res = numericp(match[1]) ? parseFloat(match[1]) : match[1];
  return [res, match[2]];
  // keys
}

l(parseExpr('(1)')[0]);


cdbg = code => {
  let qb = [];
  let c = yeet(qb, parseExpr(code)[0]);
  console.log(qb, c);
}

run = x => cmpl(parseExpr(x)[0]);


wslime.load('src/tests.js');
