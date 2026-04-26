import { 
    Exp, Program, isProgram, isDefineExp, isNumExp, isBoolExp, 
    isStrExp, isPrimOp, isVarRef, isIfExp, isAppExp, isProcExp 
} from './L3/L3-ast';
import { Result, makeFailure, makeOk, bind, mapResult } from './shared/result';

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [Exp | Program] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string> => {
    // Program: Translate all expressions and join them with a newline
    if (isProgram(exp)) {
        return bind(mapResult(l2ToPython, exp.exps), exps => makeOk(exps.join("\n")));
    }
    // Define: var = val
    if (isDefineExp(exp)) {
        return bind(l2ToPython(exp.val), val => makeOk(`${exp.var.var} = ${val}`));
    }
    // Numbers: just convert to string
    if (isNumExp(exp)) {
        return makeOk(exp.val.toString());
    }
    // Booleans: Python capitalizes True and False
    if (isBoolExp(exp)) {
        return makeOk(exp.val ? "True" : "False");
    }
    // Strings: wrap in quotes
    if (isStrExp(exp)) {
        return makeOk(`"${exp.val}"`);
    }
    // Variable reference: just the variable name
    if (isVarRef(exp)) {
        return makeOk(exp.var);
    }
    // Primitive operations evaluated directly (like the `boolean?` example in the PDF)
    if (isPrimOp(exp)) {
        if (exp.op === "boolean?") return makeOk("(lambda x: (type(x) == bool))");
        if (exp.op === "number?") return makeOk("(lambda x: (type(x) == int or type(x) == float))");
        return makeOk(exp.op);
    }
    // If expression: (then if test else alt)
    if (isIfExp(exp)) {
        return bind(l2ToPython(exp.then), thenExp =>
               bind(l2ToPython(exp.test), testExp =>
               bind(l2ToPython(exp.alt), altExp =>
               makeOk(`(${thenExp} if ${testExp} else ${altExp})`))));
    }
    // Procedure (lambda): (lambda args: body)
    if (isProcExp(exp)) {
        const args = exp.args.map(a => a.var).join(", ");
        // The instructions say we can assume the body has only one expression
        const bodyResult = l2ToPython(exp.body[0]); 
        return bind(bodyResult, body => 
            makeOk(args === "" ? `(lambda: ${body})` : `(lambda ${args}: ${body})`)
        );
    }
    // Application: rator(rands) OR binary operations (a + b)
    if (isAppExp(exp)) {
        // Special formatting for primitive operators
        if (isPrimOp(exp.rator)) {
            const op = exp.rator.op;
            
            // Unary 'not' -> (not rand)
            if (op === "not") {
                return bind(l2ToPython(exp.rands[0]), rand => makeOk(`(not ${rand})`));
            }
            
            // Binary operators -> (rand1 op rand2)
            if (["+", "-", "*", "/", "<", ">", "=", "eq?", "and", "or"].indexOf(op) !== -1) {
                return bind(l2ToPython(exp.rands[0]), r1 =>
                       bind(l2ToPython(exp.rands[1]), r2 => {
                           // Convert Scheme equality to Python equality
                           const pyOp = (op === "=" || op === "eq?") ? "==" : op;
                           return makeOk(`(${r1} ${pyOp} ${r2})`);
                       }));
            }
        }
        
        // General Application (e.g., function calls, or when boolean? is evaluated)
        return bind(l2ToPython(exp.rator), rator =>
               bind(mapResult(l2ToPython, exp.rands), rands =>
               makeOk(`${rator}(${rands.join(", ")})`)));
    }
    
    return makeFailure(`Unknown expression type`);
};