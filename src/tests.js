//await wslime.load('src/tester.js')

allPassed = true;

isSubclass = (A, B) => A.prototype instanceof B || A === B;
//TODO - understand

exoreq = (ref, res) =>
  (isSubclass(ref, Error) && res instanceof ref) 
  || equal(ref, res);


test(exoreq, stringify, [
  [stringify, 'stringify'],
  [Error, 'Error'],
  [() => 1, '() => 1'],
  [null, 'null'],
  [[], '[]'],
  [[1, 2, 3], 0, '[...]'],
  [[1, 2, 3], 1, '[1, 2, 3]'],
  [[1, 2, [3, 4]], '[1, 2, [3, 4]]'],
]);


test(exoreq, read, [
  ['(1)', ['1']],
  ['(', ParseError],
  [')', ParseError],
  ['("a" "b")', ['"a"', '"b"']]
]);

test(exoreq, run, [
  ["(' (1 (2 \"l\") 4))", ['1', ['2', '"l"'], '4']],
  ["(` (1 (2 (, (+ 1 2))) (,@ (L 4 5))))", ['1', ['2', 3], 4, 5]],
  ['(car (L 1 2 3 4))', 1],
  ['(cdr (L 1 2 3 4))', [2, 3, 4]],
])


/*
test(exoreq, x => x, [[1, 0]]);
test(exoreq, x => x, [[0, 3]]);
*/

if (allPassed) l("All tests passed");
