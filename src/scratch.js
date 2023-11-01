
l(cmpl(["'", ['+']]));

cdbg("(' (+))");

cdbg("(imp 1 2 3)");

l(run("(imp (l 1) (return 2))"));




l(parseExpr('("1 2 " (+ 3 5) 3)'));

l(run('(+ 1 2)'));

l(run("(' (1 2 3))")); //why strings?

l(run("(cons 1 (list 1 2))"));

l(run("(cons 1 (' (1 2 3)))"));

l(run("(concat (' (1 2 3)) (' (4 5 6)))"));

l(run("(concat (' (1 2 3)) (' (4 :x 5 :y 6)))"));

l(run("(' (4 :x 5 :y 6))"));

l(parseExpr("(:x 2 3 :y 3)"))


