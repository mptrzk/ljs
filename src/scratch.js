
l(parseExpr('(1)')[0]);

l(cmpl(["'", ['+']]));

//cdbg("(' (+))");

cdbg("(imp 1 2 3)");

l(run("(imp (l 1) (return 2))"));

l(qqsub(parseExpr("((, foo) (,@ bar) (, baz))")[0], [1, [2, 3], 4]));

l(qqextract(parseExpr("((, foo) (,@ (1 2 3)) (, baz))")[0]));

l(run("(` (0 (1 (, (+ 1 1)) (,@ (list 3 4 5)))))"));

l(run("(` ((1 (, (+ 1 1)) (,@ (list 3 4 5))) :x 0))").x);//TODO fix
//array.map doesn't work with keys, right?


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

l(parseExpr("(:x 2 3 :y 3)")[0].kmap(x => 2*x))


