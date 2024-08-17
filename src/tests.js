//await wslime.load('src/tester.js')

allPassed = true;

isSubclass = (A, B) => A.prototype instanceof B || A === B;
//TODO - understand


//TODO flip order of arguments
exoreq = (ref, res) =>
  (isSubclass(ref, Error) && res instanceof ref) 
  || equal(ref, res);

//test exoreq?

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
  ['(1 2)', ['1', '2']],
  ['(1 \n 2)', ['1', '2']],
  ['(', ParseError],
  [')', ParseError],
  ['("a" "b")', ['"a"', '"b"']]
]);

//['(1 \n 2)', ['1', '2']], //why is it uncaught
//because you set wslime to run ljs


test(exoreq, run, [
  ["(== (+ 1 2) (- 6 3))", true],
  ["(' (1 (2 \"l\") 4))", 
    ['1', ['2', '"l"'], '4']],
  ["(` (1 (2 (, (+ 1 2))) (,@ (L 4 5))))",
    ['1', ['2', 3], 4, 5]],
  ['(car (L 1 2 3 4))', 1],
  ['(cdr (L 1 2 3 4))', [2, 3, 4]],
  ['(@ ([ 1 ([ 2 3) 4) 1 0)', 2],
  ['(. ({ (x 1) (y 2)) y)', 2],
  ['(. ({ (x 1) (((+ "x" "y")) 2)) xy)', 2],
  ['((fn (x) (+ x 2)) 4)', 6],
  ['(((fn (x) (fn (y) (+ x y))) 2) 4)', 6],
  ['(throw (new TypeError))', Error],
  ['((fn (([ x y)) y) ([ 1 2))', 2],
  ['((fn (([ x (= y 2))) y) ([ 1))', 2],
  //['((fn (({ x y})) y) ({ (x 1) (y 2) (z 3)))', 2],
  //TODO how to catch errors like that?
  ['((fn (({ x y)) y) ({ (x 1) (y 2) (z 3)))', 2],
  ['((fn (({ x (y a))) a) ({ (x 1) (y 2) (z 3)))', 2],
])
//TODO throw a nice error when the test list is malformed

//['(((fn (x) (fn (y) (x + y))) 2) 4)', 6],
//['(throw new TypeError)', Error], //should this work?


/*
test(exoreq, x => x, [[1, 0]]);
test(exoreq, x => x, [[0, 3]]);
test(exoreq, x => x, [[(() => {throw Error})(), 3]]);
//^^ TODO is this alright?
*/

if (allPassed) l("All tests passed");
