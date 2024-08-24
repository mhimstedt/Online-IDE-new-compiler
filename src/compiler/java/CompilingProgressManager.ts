export class CompilingProgressManagerException {

}

export class CompilingProgressManager {

    private doLogging: boolean = false;

    private timeStarted: number = 0;
    private lastInterruptionTime: number = 0;
    private numberOfInterruptions: number = 0;
    private interruptAndRestartFlag: boolean = false;
    private newOrDirtyModules: string = "";
    private _isInsideCompilationRun: boolean = false;

    private interruptAtLeastEveryMs: number = 30;
    private interruptForMs: 5;


    private nextRunWithoutInterruptions: boolean = false;

    get isInsideCompilationRun(): boolean {
        return this._isInsideCompilationRun;
    }

    initBeforeCompiling(){
        this.timeStarted = this.lastInterruptionTime = performance.now();
        this.interruptAndRestartFlag = false;
        this.numberOfInterruptions = 0;
        if(this.nextRunWithoutInterruptions) this.lastInterruptionTime += 1e6;
        this.nextRunWithoutInterruptions = false;
        this.newOrDirtyModules = "---";
        this._isInsideCompilationRun = true;
    }

    afterCompiling(exception?: string){
        this._isInsideCompilationRun = false;
        let dt = performance.now() - this.timeStarted;
        if(this.doLogging && this.newOrDirtyModules != '---'){
            let withException: string = exception ? " with Exception " : "";
            console.log("Compiled modules [" + this.newOrDirtyModules + "]" + withException + "; Compilation run took " + Math.round(dt) + " ms and was " + this.numberOfInterruptions + " times interrupted.");
        }
    }

    async interruptIfNeeded(): Promise<void> {
        let dt = performance.now() - this.lastInterruptionTime;
        if(dt >= this.interruptAtLeastEveryMs){
            if(this.doLogging){
                console.log("Compiler was interrupted by CompilingProgressManger.");
            }
            this.numberOfInterruptions++;
            await this.setTimeout(this.interruptForMs);
            this.lastInterruptionTime = performance.now();
            if(this.interruptAndRestartFlag) throw new CompilingProgressManagerException();
        }
    }

    async setTimeout(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    interruptCompilerIfRunning(nextRunWithoutInterruptions: boolean){
        if(this.doLogging) console.log("Request to interrupt compiler by JavaCompletionItemProvider");
        this.interruptAndRestartFlag = true;
        this.nextRunWithoutInterruptions = nextRunWithoutInterruptions;
    }

    restartNecessary(){
        return this.interruptAndRestartFlag;
    }

    setNewOrDirtyModules(newOrDirtyModules: string){
        this.newOrDirtyModules = newOrDirtyModules;
    }

}