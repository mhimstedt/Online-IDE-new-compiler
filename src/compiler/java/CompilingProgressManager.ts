export class CompilingProgressManagerException {

}

export class CompilingProgressManager {
    private timeStarted: number = 0;
    private lastInterruptionTime: number = 0;

    private interruptAtLeastEveryMs: 50;
    private interruptForMs: 5;

    private interruptAndRestart: boolean = false;

    start(){
        this.timeStarted = this.lastInterruptionTime = performance.now();
        this.interruptAndRestart = false;
    }

    async interruptIfNeeded(): Promise<void> {
        let time = performance.now();
        if(time - this.lastInterruptionTime >= this.interruptAtLeastEveryMs){
            console.log("Compiler was interrupted by CompilingProgressManger.");
            await this.setTimeout(this.interruptForMs);
            this.lastInterruptionTime = performance.now();
            if(this.interruptAndRestart) throw new CompilingProgressManagerException();
        }
    }

    async setTimeout(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    doRestart(){
        this.interruptAndRestart = true;
    }

    restartNecessary(){
        return this.interruptAndRestart;
    }
}