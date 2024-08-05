resf = f => {
  try {
    return {val: f(), thrown: false};
  } catch (e) {
    return {val: e, thrown: true};
  }
}

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
  let link = document.createElement('a');
  link.innerText = code.toString();
  link.href = `javascript:{debugger; (${code.toString()})();}`;
  document.body.innerHTML += '<br>';
  document.body.appendChild(link);
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
