stringify = (x, depth=0) => {
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


testMsg = (name, code, args, res) => {
  [name, code, val] = [name, code, res.val]
    .map(x => stringify(x, 2));
  args = args.map(x => stringify(x, 0));
  window.allPassed = false;
  //TODO come up with a good abstraction to do it
  let tdesc = res.thrown ?
    'exception was thrown'
    : 'returned value';
  console.error(
    `${name}(${code}, ${args.join(', ')}) failed\n`
    + `${tdesc}:\n${val}\n`
    //+ res.thrown ? res.val.stack : '' //TODO ???
  );
}

//predicate has form (result, ...args) -> bool
defTestFun = (name, predicate, prepf) => {
  window[name] = (code, ...args) => {
    let thunk = prepf ? prepf(code) : code;
    let res = resf(thunk);
    if (predicate(res, ...args)) return true;
    testMsg(name, code, args, res);
    return false;
  }
}



//edge case - stuff with pname?
dbglink = (fn, args) => {
  let link = document.createElement('div');
  link.style.color = 'cyan';
  link.style.textDecoration = 'underline'; //TODO <a> tag?
  let fntxt = stringify(fn);
  let argtxt = args.map(stringify).join(', ');
  link.innerText = `${fntxt}(${argtxt})`;
  link.onclick = () => {debugger; fn(...args);};
  document.body.innerHTML += '<br>';
  document.body.appendChild(link);
}


tmsg = (fn, args, res, ref) => {
  [fn, res, ref] = [fn, res, ref].map(stringify); 
  args = args.map(stringify).join(', ');
  console.error(
    `[FAILED] ${ref} ~~ ${fn}(${args})\n` 
    + `result:\n`
    + `${res}`
  );
}

test = (pred, fn, tests) => 
  tests.map(([ref, ...args]) => {
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
