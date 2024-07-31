resf = f => {
  try {
    return {val: f(), thrown: false};
  } catch (e) {
    return {val: e, thrown: true};
  }
}

testMsg = (name, thunk, args, res) => {
  window.allPassed = false;
  //TODO come up with a good abstraction to do it
  let link = document.createElement('a');
  link.innerText = thunk.toString();
  link.href = `javascript:{debugger; (${thunk.toString()})();}`;
  document.body.innerHTML += '<br>';
  document.body.appendChild(link);
  let tdesc = res.thrown ?
    'exception was thrown'
    : 'returned value';
  console.error(
    `${name}(${thunk}, ${args.join(', ')}) failed\n`
    + `${tdesc}:\n${res.val}\n`
    //+ res.thrown ? res.val.stack : '' //TODO ???
  );
}

//predicate has form (result, ...args) -> bool
defTestFun = (name, predicate) => {
  window[name] = (thunk, ...args) => {
    let res = resf(thunk);
    if (predicate(res, ...args)) return true;
    testMsg(name, thunk, args, res);
    return false;
  }
}
