testsPassed = true;

test = (thunk, exception=undefined) => {
  //TODO enforce proper exception type?
  try {
    let res = thunk(); 
    if (exception !== undefined) {
      //vv doing it here seems like a bad idea
      testsPassed = false;
      console.error(
        `${thunk.toString()}\n`
        +`Expected "${exception.name}" to be thrown\n`
        +`Got "${res}" instead`
      );
    } else if (!res) {
      testsPassed = false;
      console.error(
        `${thunk.toString()}\n`
        +`Expected "true"\n`
        +`Got "${res}" instead`
      );
      //something better than "expected true"?
    }
  } catch (e) {
    if (exception === undefined) {
      testsPassed = false;
      console.error(
        `${thunk.toString()}\n`
        +`Expected "true"\n`
        +`"${e}" was thrown instead`
      );
    } else if (!(e instanceof exception)) {
      testsPassed = false;
      console.error(
        `${thunk.toString()}\n`
        +`Expected "${new exception}" to be thrown\n`
        +`"${e}" was thrown instead`
      );
    }
  }
}


resf = f => {
  try {
    return {val: f(), thrown: false};
  } catch (e) {
    return {val: e, thrown: true};
  }
}

l(resf(() => {throw Error;}).thrown);

testMsg = (tf, f, p, res) => {
  link = document.createElement('a');
  link.innerText = f.toString();
  link.href = `javascript:{debugger; (${f.toString()})();}`
  console.log(link.outerHTML);
  document.body.innerHTML += '<br>';
  document.body.appendChild(link);
  console.error(
    `${tf}(${f}, ${p.pname ?? p}) failed\n`
    + `${res.val} ${res.thrown ? 'was thrown' : 'was returned'}\n`
  );
}

test = (f, p) => {
  res = resf(f);
  if (!res.thrown && p(res.val)) return;
  testMsg('test', f, p, res);
}

testEx = (f, E) => {
  res = resf(f);
  if (res.thrown && res.val instanceof E) return;
  testMsg('test', f, p, res);
}

test(() => {throw new TypeError;}, x => x === 1);

defTp = (name, f) => {
  window[name] = x => {
    let g = f(x);
    g.pname = `${name}(${x})`
    return g;
  }
}



//it's not predicate, it's predicate "generator"
//what a naming clusterfuck

defTp('isTp', x => (y => x === y))
//naah, the name is bound here
//what I want takes the higher order function
//and returns 

/*
isTp = x => {
  let f = y => x === y;
  f.pname = `isTp(${x})`
  return f;
};
*/

//"baptise" function?
//cname?




//generating predicates?
//defTp
//using generic currying

test(() => 2 + 2, isTp(5));


testEx(() => {throw new TypeError;}, Error);

/*
test(() => true);
test(() => {throw new TypeError;}, Error);
test(() => false);
test(() => true, Error);
test(() => {throw new Error;}, TypeError);
test(() => {throw new Error;});
*/
