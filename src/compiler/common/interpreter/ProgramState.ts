import { ObjectClass } from "../../java/runtime/system/javalang/ObjectClassStringClass";
import { ExceptionInfo, Exception } from "./ExceptionInfo";
import { Program, Step } from "./Program";



export type ProgramState = {
    program: Program;
    currentStepList: Step[]; // Link to program.stepSingle or program.stepMultiple
    stepIndex: number;
    stackBase: number;
    callbackAfterFinished?: () => void;
    exceptionInfoList: ExceptionInfo[];

    recentlyThrownException?: Exception;
    afterExceptionTrimStackToSize?: number; // stack size when entering try {...} block

    aquiredObjectLocks?: ObjectClass[];

    lastExecutedStep?: Step;

};
