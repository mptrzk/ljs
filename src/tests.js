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
//if you read it after a while it might look like
//"code" means the same thing

//testLjs = (a, b) => testEqual(() => run(a), run(b));
//kinda breaks

testLjs('(list 1 2 3)', '(list 1 2 3)');

testEqual(() => read('1'), '1');
testEqual(() => read('"1"'), '"1"');
testEqual(() => read('"1 dfdf"'), '"1 dfdf"');
testEqual(() => read('(1 2 3)'), ['1', '2', '3']);
testEx(() => read('(1 2 3))'), ParseError);
//TODO tests for exceptions

testEqual(() => run("(' (1 2 3))"), ['1', '2', '3']);
testEx(() => read('(1'), ParseError);


assert2(ljsEval(4), 4);
//how about string atoms?
assert2(ljsEval(['&&', ['+', '4', '2'], '!true']), false);
assert2(ljsEval(["'", [1, 2, 3]]), [1, 2, 3]);

assert2(ljsEval(['cdr', ["'", [1, 2, 3]]]), [2, 3]);



if (allPassed) l("All tests passed");
