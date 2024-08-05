car = x => x[0];
cdr = x => x.slice(1);
cons = (x, y) => [x, ...y];
list = (...args) => args;
L = list;
concat = (...args) => [].concat(...args);
