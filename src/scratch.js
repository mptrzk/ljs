
l(cmpl(["'", ['+']]));

cdbg("(' (+))");

cdbg("(imp 1 2 3)");

l(run("(imp (l 1) (return 2))"));

l(qqsub(parseExpr("((, foo) (,@ bar) (, baz))")[0], [1, [2, 3], 4]));

l(qqextract(parseExpr("((, foo) (,@ (1 2 3)) (, baz))")[0]));

l(run("(` (0 (1 (, (+ 1 1)) (,@ (list 3 4 5)))))"));

cdbg("((, 1) (,@ (1 2 3)) (, 4))");


l(parseExpr('("1 2 " (+ 3 5) 3)'));

l(run('(imp (for (i 0 (< i 10) (++ i)) (l i)))'));

cdbg('(for (i 0 (< i 10) (++ i)) (l i))');

l(run('(+ 1 2)'));

l(run("(' (1 2 3))"));

l(run("(cons 1 (list 1 2))"));

l(run("(cons 1 (' (1 2 3)))"));

l(run("(concat (' (1 2 3)) (' (4 5 6)))"));

l(run("(concat (' (1 2 3)) (' (4 :x 5 :y 6)))"));

l(run("(' (4 :x 5 :y 6))"));

l(parseExpr("(:x 2 3 :y 3)"))


