import * as THREE from 'three';
import { PixiSpritesheetData } from '../../../../../client/spritemanager/PixiSpritesheetData';
import { Interpreter } from '../../../../common/interpreter/Interpreter';
import { JRC } from '../../../language/JavaRuntimeLibraryComments';
import { RuntimeExceptionClass } from '../../system/javalang/RuntimeException';
import spritesheetjson from '/include/graphics/spritesheet.json.txt';
import spritesheetpng from '/include/graphics/spritesheet.png';

export class TextureManager3d {

    systemSpritesheetData: PixiSpritesheetData;
    systemTexture: THREE.Texture;

    userSpritesheetData: PixiSpritesheetData;
    userTexture: THREE.Texture;


    async init(interpreter: Interpreter) {

        /**
         * Create systemTexture
         */
        let pathPraefix: string = "";
        //@ts-ignore
        if (window.javaOnlineDir != null) {
            //@ts-ignore
            pathPraefix = window.javaOnlineDir;
        }

        if (pathPraefix.endsWith("/")) {
            pathPraefix = pathPraefix.substring(0, pathPraefix.length - 1);
        }

        this.systemTexture = await new THREE.TextureLoader().loadAsync(pathPraefix + spritesheetpng);
        this.systemTexture.colorSpace = THREE.SRGBColorSpace;
        this.systemTexture.magFilter = THREE.NearestFilter;

        this.systemSpritesheetData = await (await fetch(pathPraefix + `${spritesheetjson}`)).json();


        /**
         * Create userTexture
         */
        let graphicsManager = interpreter.graphicsManager;
        if (graphicsManager && graphicsManager.pixiSpritesheetData) {
            this.userSpritesheetData = graphicsManager.pixiSpritesheetData;
            this.userTexture = new THREE.DataTexture(graphicsManager.pngImageData, this.userSpritesheetData.meta.size.w, this.userSpritesheetData.meta.size.h,
                THREE.RGBAFormat, THREE.ByteType, undefined, undefined, undefined, THREE.NearestFilter, THREE.NearestFilter, undefined, THREE.SRGBColorSpace
            )
            this.userTexture.needsUpdate = true;
        }


    }

    getTexture(spritesheet: string, index: number) {
        let key: string = spritesheet + "#" + index;
        let frame = this.systemSpritesheetData.frames[key];
        let t: THREE.Texture;
        if (frame) {
            t = this.systemTexture.clone();
        } else {
            frame = this.userSpritesheetData?.frames[key];
            if (!frame) {
                throw new RuntimeExceptionClass(JRC.textureNotFoundError(spritesheet, index));
            }
            t = this.userTexture.clone();
        }

        let data = frame.frame;

        t.repeat.set(data.w / this.systemTexture.image.width, data.h / this.systemTexture.image.height);
        t.offset.x = data.x / this.systemTexture.image.width;
        t.offset.y = 1 - data.h / this.systemTexture.image.height - data.y / this.systemTexture.image.height;

        t.colorSpace = THREE.SRGBColorSpace;
        t.magFilter = THREE.NearestFilter;

        return t;
    }

}