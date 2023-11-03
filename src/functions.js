car = x => x[0];
cdr = x => x.slice(1);
cons = (x, y) => [x, ...y];
list = (...args) => args;
concat = (...args) => [].concat(...args);
