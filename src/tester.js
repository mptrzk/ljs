stringify = (x, depth=4) => {
  if (x === undefined) return 'undefined';
  if (typeof(x) === 'function') {
    if (x.name) return x.name;
    if (x.pname) return x.pname; //is this necessary?
    //using let instead of window[fsdfds] for defException
    //no, you can't use "let"
    return x.toString();
  }
  if (typeof(x) === 'object') {
    if (x === null) return 'null';
    if (x instanceof Array) {
      if (depth === 0) return `[${x.length ? '...' : ''}]`;
      return `[${x.map(y => stringify(y, depth - 1)).join(', ')}]`;
    }
      if (depth === 0) return `{${x.length ? '...' : ''}}`;
      let content = Object.entries(x)
      .map(([k, v]) => `${k}: ${stringify(v, depth - 1)}`)
      .join(', ');
    return `{${content}}`;
  }
  if (typeof(x) === 'string') {
    if (x.includes("'")) {
      if (x.includes('"')) {
        return `'${x.replace("'", "\\'")}'`;
      }
      return `"${x}"`;
    }
    return `'${x}'`;
  }
  return x.toString();
}


//edge case - stuff with pname?
dbglink = (fn, args) => {
  let link = document.createElement('div');
  link.style.color = 'cyan';
  link.style.textDecoration = 'underline'; //TODO <a> tag?
  let fntxt = stringify(fn);
  if (!fn.name && !fn.pname) fntxt = `(${fntxt})`;
  let argtxt = args.map(stringify).join(', ');
  link.innerText = `${fntxt}(${argtxt})`;
  link.onclick = () => {debugger; fn(...args);};
  document.body.appendChild(link);
}


tmsg = (fn, args, res, ref) => {
  [fn, res, ref] = [fn, res, ref].map(x => stringify(x)); 
  args = args.map(x => stringify(x)).join(', ');
  console.error(
    `[FAILED] ${ref} ~~ ${fn}(${args})\n` 
    + `result:\n`
    + `${res}`
  );
}


test = (pred, fn, tests) => 
  tests.map(expr => {
    let args = expr.slice(0, -1);
    let ref = expr[expr.length - 1];
    let res; 
    try {
      res = fn(...args);
    } catch (e) {
      res = e;
    }
    if (pred(ref, res)) return true;
    tmsg(fn, args, res, ref);
    dbglink(fn, args);
    allPassed = false; //TODO remove?
    return false;
  });
