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
}

/*
defException('FooError', Error);
defException('BarError', Error);
defException('BazError', BarError);

l(new FooError('foo') instanceof Error);
l(new FooError('foo') instanceof FooError);
l(!(new FooError('foo') instanceof BarError));
l(new BazError('foo') instanceof BarError);
l(new BazError('foo') instanceof Error);
*/



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
    let [first, rest] = parseExpr(str);
    lst.push(first);
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



compile = (qb, code) => { //qb contains side effects
  if (isArray(code)) {
    let [op, ...args] = code;
    let m = cmacros.get(op);
    if (m === undefined) {
      let a = args.map(x => compile(qb, x)); 
      return `${op}(${a.toString()})`;
    }
    return m(qb, ...args);
  }
  return code;
}

ljsEval = code => {
  let qb = [];
  let js = compile(qb, code); 
  return (() => {}).constructor('__quotes', `return ${js};`)(qb);
}
// cmpl -> ljsEval
//should "compile" execute?

run = x => ljsEval(read(x));

//can be simplified to an one liner TODO?
cdbg = code => {
  let qb = [];
  let js = compile(qb, read(code));
  console.log(js);
}

rdbg = x => l(run(x));


/*
  //why does it give __quotes[1] instead of __quotes[0]?
//and it works as expected!

rdbg("(+ 1 (' (1 2 3)))")


l(1 + [1, 2, 3])
*/
//TODO describe a bug that happened here when the file got
//reloaded
//
//


//^^ TODO - can lack of await cause bugs here?

document.body.style = `
  background-color: #011;
  font-family: monospace;
  color: #ff8
`
document.body.innerText =  '(some lisp-like code)';

await wslime.load('src/tests.js');
