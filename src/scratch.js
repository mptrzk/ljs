
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

rdbg("(' (1 2 3))");

cdbg("(' (1 2 3)))");
cdbg("(new (' (1 2 3))))");
cdbg("(new (new (' (1 2 3)))))");
cdbg("(new (new (new (' (1 2 3))))))");
cdbg("(new (new (new (new (' (1 2 3)))))))");
cdbg("(new (new (new (new (new (' (1 2 3))))))))");


cdbg("(` (1 (, (foo 2 3))))")



rdbg('((fn (([ x y])) y) ([ 1 2))');

rdbg('((fn (([ x (= y 2))) y) ([ 1))');

cdbg('((fn (({ x y)) y) ({ (x 1) (y 2) (z 3)))');

cdbg('((fn (({ x (a y))) a) ({ (x 1) (y 2) (z 3)))');

rdbg('((fn (({ x (y a))) a) ({ (x 1) (y 2) (z 3)))');


rdbg('(`a (a x 3))')


read('(1 \n 2)');
