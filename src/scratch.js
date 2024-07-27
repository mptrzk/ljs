
l(parseExpr('(1)')[0]);

l(ljsEval(["'", ['+']]));

//cdbg("(' (+))");

cdbg("(imp 1 2 3)");

l(qqextract(read("((, foo) (,@ (1 2 3)) (, baz))")));

l(run("(` (0 (1 (, (+ 1 1)) (,@ (list 3 4 5)))))"));

l(run("(` 1)")); //TODO?

l(run("(` (1 (, l) 3))"));

l(run("(` ((1 (, (+ 1 1)) (,@ (list 3 4 5))) x 2))"));


l(parseExpr('("1 2 " (+ 3 5) 3)'));

l(run('(imp (for ((let i 0) (< i 10) (+= i 2)) (l i)))'));

cdbg('(for ((let i 0) (< i 10) (++ i)) (l i) (l (* i 2)))');

l(run('(+ 1 2 3)'));

cdbg('(+ 1 2 1)'); //TODO why?

//cdbg('(+ 1 2 1 )'); //TODO fix parsing

l(run("(' (1 2 3))"));

l(run("(cons 1 (list 1 2))"));

l(run("(cons 1 (' (1 2 3)))"));

l(run("(concat (' (1 2 3)) (' (4 5 6)))"));

l(run("(concat (' (1 2 3)) (' (4 :x 5 :y 6)))"));

l(run("(' (4 :x 5 :y 6))"));

cdbg("(+ 1 (' (1 2 3)))");

cdbg("(' (1 2 3)))");

cdbg("(' (1 2 3)))");
cdbg("(new (' (1 2 3))))");
cdbg("(new (new (' (1 2 3)))))");
cdbg("(new (new (new (' (1 2 3))))))");
cdbg("(new (new (new (new (' (1 2 3)))))))");
cdbg("(new (new (new (new (new (' (1 2 3))))))))");

foo = x => {
  if (x != 0) return x + x * x;
  else throw new TypeError('boo!');
}


reterr = (f, ...args) => {
  try {
    return f(...args);
  } catch (e) {
    return e
  }
}

l(reterr(foo, 1));

l(reterr(foo, 0) instanceof Error);
//expect(() => bleh).toThrow(BlahError)
//


defException = (name, superclass) => {
  window[name] = class extends superclass {
    constructor(message) {
      super(message);
      this.name = name;
    }
  }
}

defException('FooError', Error);
defException('BarError', Error);
defException('BazError', BarError);

l(new FooError('foo') instanceof Error);
l(new FooError('foo') instanceof FooError);
l(!(new FooError('foo') instanceof BarError));
l(new BazError('foo') instanceof BarError);
l(new BazError('foo') instanceof Error);

//TODO convert to prototype based inheritance
//make an easy way to generate those
//defException('name', 'superclass')



