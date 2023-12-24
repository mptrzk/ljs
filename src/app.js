document.body.innerHTML = '<h1>Hello, World!</h1>';

l = console.log

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
isNumeric = x => !isNaN(x);
isArray = Array.isArray;

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
  let res = isNumeric(match[1]) ? parseFloat(match[1]) : match[1];
  return [res, match[2]];
  // keys
}

read = code => parseExpr(code)[0];


cmacros = new Map();

Array.prototype.kmap = function (fn) {
  ret = [];
  Object.keys(this).forEach(k => ret[k] = fn(this[k]));
  return ret;
}

expand = (qb, code) => {
  if (isArray(code)) {
    let [op, ...args] = code;
    let m = cmacros.get(op);
    let a = args.map(x => expand(qb, x));
    if (m === undefined) return `${op}(${a.toString()})`;
    return m(qb, ...args);
  }
  return code;
}

cmpl = code => {
  let qb = [];
  let js = expand(qb, code); 
  return (() => {}).constructor('__quotes', `return ${js};`)(qb);
}

cdbg = code => {
  let qb = [];
  let c = expand(qb, read(code));
  console.log(c);
}

run = x => cmpl(read(x));


await wslime.load('src/functions.js');
await wslime.load('src/cmacros.js');
await wslime.load('src/tests.js');
//^^ TODO - can lack of await cause bugs here?
