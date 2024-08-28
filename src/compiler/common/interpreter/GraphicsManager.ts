import * as PIXI from 'pixi.js';
import { JRC } from '../../java/language/JavaRuntimeLibraryComments';
import { RuntimeExceptionClass } from '../../java/runtime/system/javalang/RuntimeException';
import { Interpreter } from './Interpreter';
import { PixiSpritesheetData } from '../../../client/spritemanager/PixiSpritesheetData';

export interface GraphicSystem {
    getIdentifier(): string;
}


export class GraphicsManager {

    pixiSpritesheetData: PixiSpritesheetData;
    pngImageData: Uint8Array;

    // if 2d world is used then this is defined:
    public pixiUserSpritesheet?: PIXI.Spritesheet;

    // if 3d world is used then this is defined:


    currentGraphicSystem?: GraphicSystem;

    interpreter?: Interpreter;

    constructor(public graphicsDiv: HTMLElement | null) {

    }

    registerGraphicSystem(graphicSystem: GraphicSystem) {
        if (this.currentGraphicSystem) {
            throw new RuntimeExceptionClass(JRC.GraphicSystemNotAvailableError(this.currentGraphicSystem.getIdentifier(), graphicSystem.getIdentifier()));
        }

        this.currentGraphicSystem = graphicSystem;
    }

    setInterpreter(interpreter: Interpreter) {
        this.interpreter = interpreter;
        interpreter.eventManager.on("resetRuntime", () => {
            this.currentGraphicSystem = undefined;
        });
    }

    setUserData(pixiSpritesheetData: PixiSpritesheetData, pngImageData: Uint8Array){
        this.pixiSpritesheetData = pixiSpritesheetData;
        this.pngImageData = pngImageData;
        if(this.pixiUserSpritesheet){
            this.pixiUserSpritesheet.destroy();
            this.pixiUserSpritesheet = undefined;
        }
    }

    async initPixiUserSpritesheet() {

        if(!this.pixiUserSpritesheet && this.pixiSpritesheetData && this.pngImageData){
            // see https://pixijs.com/8.x/guides/migrations/v8
            let textureNew = PIXI.Texture.from(new PIXI.BufferImageSource({
                resource: this.pngImageData,
                width: this.pixiSpritesheetData.meta.size.w,
                height: this.pixiSpritesheetData.meta.size.h
            }))
    
            this.pixiUserSpritesheet = new PIXI.Spritesheet(textureNew, this.pixiSpritesheetData);
            await this.pixiUserSpritesheet.parse()
        }

        return this.pixiUserSpritesheet;

    }

    

}