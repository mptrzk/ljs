//await wslime.load('src/tester.js')

allPassed = true;

exoreq = (ref, res) => 
  (res instanceof Error && res instanceof ref) 
  || equal(ref, res);


test(exoreq, stringify, [
  ['stringify', stringify],
  ['Error', Error],
  ['() => 1', () => 1],
  ['null', null],
  ['[]', []],
  ['[...]', [1, 2, 3]],
  ['[1, 2, 3]', [1, 2, 3], 1],
]);

test(exoreq, read, [
  [['1'], '(1)'],
  [ParseError, '('],
  [ParseError, ')'],
  [['"a"', '"b"'], '("a" "b")'],
]);

test(exoreq, run, [
  [3, '(+ 1 2)'],
  [['1', ['2', '3'], '4'], "(' (1 (2 3) 4))"],
  [1, '(car (L 1 2 3))'],
  [[2, 3], '(cdr (L 1 2 3))'],
])


if (allPassed) l("All tests passed");
