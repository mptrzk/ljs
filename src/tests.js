await wslime.load('src/tester.js')

allPassed = true;

assert2 = (x, y) => {
  console.assert(equal(x, y));
  if (!equal(x, y)) {
    allPassed = false;
  }
}
//that's a useless way of doing things
//can I print the arguments
//Ideally I'd want to be able to go to debugger right away

assert2(read('1'), 1);
assert2(read('"foo bar"'), 'foo bar');
assert2(read('(1 2 3)'), [1, 2, 3]);
assert2(read('(1 "foo bar" (3 2))'), [1, "foo bar", [3, 2]]);

assert2(ljsEval(4), 4);
//how about string atoms?
assert2(ljsEval(['&&', ['+', '4', '2'], '!true']), false);
assert2(ljsEval(["'", [1, 2, 3]]), [1, 2, 3]);

assert2(ljsEval(['cdr', ["'", [1, 2, 3]]]), [2, 3]);






if (allPassed) l("All tests passed");
