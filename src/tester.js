resf = f => {
  try {
    return {val: f(), thrown: false};
  } catch (e) {
    return {val: e, thrown: true};
  }
}

testMsg = (name, code, args, res) => {
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
    + `${tdesc}:\n${res.val}\n`
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
