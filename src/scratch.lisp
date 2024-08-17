(` (1 (, (str (+ 1 2))) 3))

(= str (fn (x) ((. x toString))))

(. document body style)

(compile (` (@ ([ 1 2 3) 1)))

((. location reload))

([ 1 (... ([ 2 3)) 4)

(@ ({ (x 1) (y ([ 1 2 3))) "y" 1)


(`a (1 (, (+ 1 1)) 3))

(= foo (fn () (blk (let x 1) (return x))))


(= foo (fn ()
           (blk (let x 1) (return x))))

(foo)

;why does it not parse?

(= x 1)
(`a (1 (, (+ 1)) x))

;TODO this captures "x" from the definition of "run"
; voodoo af
; so how about rewriting the testing thing with a macro?
; what would be advantages/disadvantages vs the way I did it so far
; an alternative is to do it with a 
;okay, I "fixed" it using indirect eval
;WTF does it work like that

;TODO skipping comments

(test exoreq run 
  ([ ([ 1 2)))


