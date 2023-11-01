console.assert(cmpl(4) === 4)
console.assert(cmpl(['&&', ['+', '4', '2'], '!true']) === false)
//console.assert(cmpl(['+']) === 0)
console.assert(equal(cmpl(["'", [1, 2, 3]]), [1, 2, 3]));
console.assert(equal(cmpl(['cdr', ["'", [1, 2, 3]]]), [2, 3]));
//^^ use deep equal
//console.log('all tests passed');
//^^why does it get executed after the asseriton failed?
// assert doesn't throw an error
