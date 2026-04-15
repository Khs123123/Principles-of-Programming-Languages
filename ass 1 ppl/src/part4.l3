; Signature: last-item(lst)
; Type: [List(T) -> T]
; Purpose: Returns the last element of a list.
; Pre-conditions: lst is not empty.
; Tests: (last-item '(1 2 3)) => 3 
(define last-item
  (λ (lst)
    (if (null? (cdr lst))
        (car lst)
        (last-item (cdr lst)))))

; Signature: remove-last-item(lst)
; Type: [List(T) -> List(T)]
; Purpose: Returns the list without the last element.
; Pre-conditions: lst is not empty.
; Tests: (remove-last-item '(1 2 3)) => '(1 2) 
(define remove-last-item
  (λ (lst)
    (if (null? (cdr lst))
        '()
        (cons (car lst) (remove-last-item (cdr lst))))))

; Signature: rotate-nth(lst, n)
; Type: [List(T) * Number -> List(T)]
; Purpose: Rotates the list n times to the right.
; Pre-conditions: n >= 0.
; Tests: (rotate-nth '(1 2 3) 1) => '(3 1 2)
(define rotate-nth
  (λ (lst n)
    (if (or (= n 0) (null? lst))
        lst
        (rotate-nth (cons (last-item lst) (remove-last-item lst)) (- n 1)))))

; Signature: deep-reverse(l)
; Type: [List(Any) -> List(Any)]
; Purpose: Returns a list with all elements reversed at every level of nesting.
; Pre-conditions: True
; Tests: (deep-reverse '(1 (2 3) (4 5))) => '((5 4) (3 2) 1)
(define deep-reverse
  (λ (l)
    (cond ((null? l) '())                     ; Base case 1: Empty list
          ((not (pair? l)) l)                 ; Base case 2: If it's an atom (not a list), just return it
          (else (append (deep-reverse (cdr l)) 
                        (list (deep-reverse (car l))))))))