l = console.log
await wslime.load('src/functions.js');
await wslime.load('src/cmacros.js');
await wslime.load('src/tester.js');
//^should those be in the beginning of the file?


defException = (name, superclass) => {
  window[name] = class extends superclass {
    constructor(message) {
      super(message);
      this.name = name;
    }
  }
  window[name].pname = name;
}



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


defException('ParseError', Error);

parseList = str => {
  //try {throw Error();} catch(e) {};
  let lst = [];
  while (str[0] != ')') {
    str = str.trim(); //yeet? move? clean up?
    if (str == '') {
      throw new ParseError("closing ')' missing");
    }
    let [first, rest] = parseExpr(str); //confusing naming
    lst.push(first);
    str = rest; //yeet
  }
  return [lst, str.slice(1)];
}

parseExpr = str => {
  str = str.trim();
  if (str == ')') throw new ParseError('opening "(" missing');
  if (str[0] == '(') return parseList(str.slice(1));
  if (str[0] == '"') {
    let match = str.match(/(".*?")(.*)/);
    return [match[1], match[2]];
  }
  let match = str.match(/([^)\s]+)(.*)/);
  let res = match[1];
  return [res, match[2]];
}


read = code => {
  if (typeof(code) !== 'string') {
    throw new ParseError('not a string');
    //should I include the argument in the error message?
  }
  let [expr, str] = parseExpr(code);
  if (str !== '') throw new ParseError('opening "(" missing');
  return expr;
}



compile = (expr) => {
  if (isArray(expr)) {
    let [op, ...args] = expr;
    let m = cmacros.get(op);
    let a = args.map(compile); 
    if (m === undefined) {
      return `${op}(${a.join(', ')})`;
    }
    return m(...args);
  }
  return expr;
}


ljsEval = expr => eval(compile(expr));

run = x => ljsEval(read(x));


cdbg = x => l(compile(read(x)))
rdbg = x => l(run(x));



document.body.style = `
  background-color: #011;
  font-family: monospace;
  color: #ff8
`
document.body.innerText =  '(some lisp-like code)';


await wslime.load('src/tests.js');
