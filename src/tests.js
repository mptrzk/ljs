//await wslime.load('src/tester.js')

allPassed = true;

assert2 = (x, y) => {
  console.assert(equal(x, y));
  if (!equal(x, y)) {
    allPassed = false;
  }
}

/*
assert2(read('1'), 1);
assert2(read('"foo bar"'), 'foo bar');
assert2(read('(1 2 3)'), [1, 2, 3]);
assert2(read('(1 "foo bar" (3 2))'), [1, "foo bar", [3, 2]]);
*/

defTestFun('testEx', (res, Exception) => {
  return res.thrown && res.val instanceof Exception;
});

defTestFun('testEqual', (res, val) => {
  return !res.thrown && equal(res.val, val);
});

defTestFun('testLjs',
  (res, code) => {
    return !res.thrown && equal(res.val, run(code));
  },
  (code) => () => run(code)
);

testEqual(() => stringify(stringify), 'stringify');
testEqual(() => stringify(Error), 'Error');
testEqual(() => stringify(() => 1), '() => 1');
testEqual(() => stringify(null), 'null');
testEqual(() => stringify([]), '[]');
testEqual(() => stringify([1, 2, 3]), '[...]');
testEqual(() => stringify([1, 2, 3], 1), '[1, 2, 3]');


testStringify = (code, ref) => {
  res = resf(eval(`stringify(${code})`));
  if (!res.thrown && equal(res, ref)) return;
  /*
  boo = (() => { 
    if code
  })();
  */
  //introducing a function without worrying about interface
  //was it one of jblow's ideas
  //how would I determine that it's a useful thing to do
  //haven't I done what I did?
  //I started writing "if (!thrown)"
  //because that's part of one of the positive conditions
  //for when the code doesn't have to run
  //I wanted to take care of that case quickly
  //logical OR and putting one statement under another
  //I should know at a glance

}

tmsg = (fn, args, res, ref) => {
  [fn, res, ref] = [fn, res, ref].map(stringify); 
  args = args.map(stringify).join(', ');
  console.error(
    `${fn}(${args}) ~ ${ref} failed\n` 
    + `result:\n`
    + `${res}`
  );
}

test = (fn, pred, tests) => 
  tests.map(([ref, ...args]) => {
    let res; 
    try {
      res = fn(...args);
    } catch (e) {
      res = e;
    }
    if (pred(ref, res)) return true;
    tmsg(fn, args, res, ref);
    allPassed = false; //TODO remove?
    return false;
  });

eqorex = (ref, res) => {
  if (res instanceof Error && res instanceof ref) return true;
  return equal(ref, res);
}

test(read, eqorex, [
  [['1'], '(1)'],
  [ParseError, '('],
]);

//reference first?
test(stringify, eqorex, [
  ['stringify', stringify],
  ['Error', Error],
  ['() => 1', () => 1],
  ['null', null],
  ['[]', []],
  ['[...]', [1, 2, 3]],
  ['[1, 2, 3]', [1, 2, 3], 1],
])




testLjs('(list 1 2 3)', '(list 1 2 3)');

testEqual(() => read('1'), '1');
testEqual(() => read('"1"'), '"1"');
testEqual(() => read('"1 dfdf"'), '"1 dfdf"');
testEqual(() => read('(1 2 3)'), ['1', '2', '3']);
testEx(() => read('(1 2 3))'), ParseError);
testEx(() => read('((1 2 3)'), ParseError);
//TODO tests for exceptions

testEqual(() => run("(' (1 2 3))"), ['1', '2', '3']);


assert2(ljsEval(4), 4);
//how about string atoms?
assert2(ljsEval(['&&', ['+', '4', '2'], '!true']), false);
assert2(ljsEval(["'", [1, 2, 3]]), [1, 2, 3]);

assert2(ljsEval(['cdr', ["'", [1, 2, 3]]]), [2, 3]);



if (allPassed) l("All tests passed");
