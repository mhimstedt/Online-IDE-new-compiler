export class CompilingProgressManagerException {

}

export class CompilingProgressManager {
    private timeStarted: number = 0;
    private lastInterruptionTime: number = 0;
    private numberOfInterruptions: number = 0;
    private interruptAndRestartFlag: boolean = false;
    private newOrDirtyModules: string = "";

    private interruptAtLeastEveryMs: 50;
    private interruptForMs: 5;


    private nextRunWithoutInterruptions: boolean = false;

    initBeforeCompiling(){
        this.timeStarted = this.lastInterruptionTime = performance.now();
        this.interruptAndRestartFlag = false;
        this.numberOfInterruptions = 0;
        if(this.nextRunWithoutInterruptions) this.lastInterruptionTime += 1e6;
        this.nextRunWithoutInterruptions = false;
        this.newOrDirtyModules = "---";
    }

    afterCompiling(){
        let dt = performance.now() - this.timeStarted;
        console.log("Compiled modules [" + this.newOrDirtyModules + "]; Compilation run took " + Math.round(dt) + " ms and was " + this.numberOfInterruptions + " times interrupted.");
    }

    async interruptIfNeeded(): Promise<void> {
        let time = performance.now();
        if(time - this.lastInterruptionTime >= this.interruptAtLeastEveryMs){
            console.log("Compiler was interrupted by CompilingProgressManger.");
            this.numberOfInterruptions++;
            await this.setTimeout(this.interruptForMs);
            this.lastInterruptionTime = performance.now();
            if(this.interruptAndRestartFlag) throw new CompilingProgressManagerException();
        }
    }

    async setTimeout(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    doRestart(nextRunWithoutInterruptions: boolean){
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