import { 
    ClassExp, ProcExp, Exp, Program, makeVarDecl, makeBoolExp, makeIfExp, 
    makeAppExp, makePrimOp, makeVarRef, makeLitExp, Binding, makeProcExp, 
    isProgram, makeProgram, isDefineExp, makeDefineExp, CExp, isNumExp, 
    isBoolExp, isStrExp, isPrimOp, isVarRef, isLitExp, isIfExp, isAppExp, 
    isProcExp, isLetExp, isClassExp, makeLetExp, makeBinding 
} from "./L3-ast";
import { Result, makeFailure, bind, mapResult, makeOk } from "../shared/result";
import { makeSymbolSExp } from "./L3-value";

/*
Purpose: Transform ClassExp to ProcExp
Signature: class2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp => {
    // We create the variable "msg" for the inner lambda
    const msgVar = makeVarDecl("msg");

    // Helper function to build the nested `if` statements for the methods
    const buildIfChain = (methods: Binding[]): CExp => {
        // Base case: No methods left, return #f (false) to indicate an error
        if (methods.length === 0) {
            return makeBoolExp(false);
        }
        
        const method = methods[0];
        
        // Check: (eq? msg 'methodName)
        const testCondition = makeAppExp(makePrimOp("eq?"), [
            makeVarRef("msg"), 
            makeLitExp(makeSymbolSExp(method.var.var))
        ]);

        // (if testCondition methodValue recursively_check_rest)
        return makeIfExp(testCondition, method.val, buildIfChain(methods.slice(1)));
    };

    // The inner body is a chain of if-statements checking the methods
    const body = buildIfChain(exp.methods);
    
    // Create the inner lambda: (lambda (msg) ...)
    const innerProc = makeProcExp([msgVar], [body]);
    
    // Create the outer lambda: (lambda (fields...) (lambda (msg) ...))
    return makeProcExp(exp.fields, [innerProc]);
};

/*
Purpose: Transform all class forms in the given AST to procs
Signature: transform(AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const transform = (exp: Exp | Program): Result<Exp | Program> =>
    isProgram(exp) ? bind(mapResult(transformExp, exp.exps), (exps: Exp[]) => makeOk(makeProgram(exps))) :
    transformExp(exp);

// Helper to handle standard expressions and definitions
const transformExp = (exp: Exp): Result<Exp> =>
    isDefineExp(exp) ? bind(transformCExp(exp.val), (val: CExp) => makeOk(makeDefineExp(exp.var, val))) :
    transformCExp(exp);

// Helper to recursively walk the CExp tree and swap ClassExps
const transformCExp = (exp: CExp): Result<CExp> =>
    isNumExp(exp) ? makeOk(exp) :
    isBoolExp(exp) ? makeOk(exp) :
    isStrExp(exp) ? makeOk(exp) :
    isPrimOp(exp) ? makeOk(exp) :
    isVarRef(exp) ? makeOk(exp) :
    isLitExp(exp) ? makeOk(exp) :
    isIfExp(exp) ? bind(transformCExp(exp.test), (test: CExp) =>
                   bind(transformCExp(exp.then), (then: CExp) =>
                   bind(transformCExp(exp.alt), (alt: CExp) =>
                   makeOk(makeIfExp(test, then, alt))))) :
    isAppExp(exp) ? bind(transformCExp(exp.rator), (rator: CExp) =>
                    bind(mapResult(transformCExp, exp.rands), (rands: CExp[]) =>
                    makeOk(makeAppExp(rator, rands)))) :
    isProcExp(exp) ? bind(mapResult(transformCExp, exp.body), (body: CExp[]) =>
                     makeOk(makeProcExp(exp.args, body))) :
    isLetExp(exp) ? bind(mapResult((b: Binding) => 
                        bind(transformCExp(b.val), (val: CExp) => 
                            makeOk(makeBinding(b.var.var, val))), exp.bindings), (bindings: Binding[]) =>
                    bind(mapResult(transformCExp, exp.body), (body: CExp[]) =>
                    makeOk(makeLetExp(bindings, body)))) :
    isClassExp(exp) ? transformCExp(class2proc(exp)) : // Apply transformation, then recursively transform the result in case there are nested classes
    makeFailure(`Unexpected CExp: ${exp}`);