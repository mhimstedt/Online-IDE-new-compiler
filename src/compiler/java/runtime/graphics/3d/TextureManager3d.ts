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

    textureCache: Map<string, THREE.Texture> = new Map();


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

        this.systemTexture.needsUpdate = true;

        this.systemSpritesheetData = await (await fetch(pathPraefix + `${spritesheetjson}`)).json();


        /**
         * Create userTexture
         */
        let graphicsManager = interpreter.graphicsManager;
        if (graphicsManager && graphicsManager.pixiSpritesheetData) {
            this.userSpritesheetData = graphicsManager.pixiSpritesheetData;
            this.userTexture = new THREE.DataTexture(graphicsManager.pngImageData, this.userSpritesheetData.meta.size.w, this.userSpritesheetData.meta.size.h,
                THREE.RGBAFormat, THREE.ByteType, undefined, undefined, undefined, THREE.NearestFilter, THREE.NearestFilter, undefined, THREE.SRGBColorSpace,
            )
            this.userTexture.needsUpdate = true;
        }


    }

    // getTextureOld(spritesheet: string, index: number) {
    //     let key: string = spritesheet + "#" + index;
    //     let frame = this.systemSpritesheetData.frames[key];
    //     let t: THREE.Texture;
    //     if (frame) {
    //         t = this.systemTexture.clone();
    //     } else {
    //         frame = this.userSpritesheetData?.frames[key];
    //         if (!frame) {
    //             throw new RuntimeExceptionClass(JRC.textureNotFoundError(spritesheet, index));
    //         }
    //         t = this.userTexture.clone();
    //     }

    //     let data = frame.frame;

    //     t.userData["isPartOfSpritesheet"] = true;

    //     t.repeat.set(data.w / this.systemTexture.image.width, data.h / this.systemTexture.image.height);
    //     t.offset.x = data.x / this.systemTexture.image.width;
    //     t.offset.y = 1 - data.h / this.systemTexture.image.height - data.y / this.systemTexture.image.height;

    //     t.colorSpace = THREE.SRGBColorSpace;
    //     t.magFilter = THREE.NearestFilter;

    //     return t;
    // }

    getTexture(spritesheet: string, index: number, renderer: THREE.WebGLRenderer) {
        let key: string = spritesheet + "#" + index;

        let texture = this.textureCache.get(key);
        if(texture) return texture;

        let frame = this.systemSpritesheetData.frames[key];
        let t: THREE.Texture;
        if (frame) {
            t = this.systemTexture;
        } else {
            frame = this.userSpritesheetData?.frames[key];
            if (!frame) {
                throw new RuntimeExceptionClass(JRC.textureNotFoundError(spritesheet, index));
            }
            t = this.userTexture;
        }

        let data = frame.frame;

        let topLeft = new THREE.Vector2(data.x, t.image.height - data.y - data.h);
        let bottomRight = topLeft.clone();
        bottomRight.x += data.w;
        bottomRight.y += data.h;

        // see https://github.com/mrdoob/three.js/issues/28282
        let renderTarget = new THREE.WebGLRenderTarget(data.w, data.h,
            { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat,
                colorSpace: THREE.SRGBColorSpace
             }
        );

        let newTexture = renderTarget.texture;
        newTexture.wrapS = THREE.RepeatWrapping;
        newTexture.wrapT = THREE.RepeatWrapping;
        newTexture.flipY = true;


        renderer.initRenderTarget(renderTarget);
        renderer.copyTextureToTexture(t, newTexture, new THREE.Box2(topLeft, bottomRight))

        this.textureCache.set(key, newTexture);
        newTexture.userData["width"] = data.w;
        newTexture.userData["height"] = data.h;

        return newTexture;

    }

    static cutoutTexture(t: THREE.Texture, renderer: THREE.WebGLRenderer): THREE.Texture {

        let imageWidth: number = Math.round(t.image.width);
        let imageHeight: number = Math.round(t.image.height);

        let textureWidth = Math.round(t.repeat.x * imageWidth);
        let textureHeight = Math.round(t.repeat.y * imageHeight);

        let v = new THREE.Vector2(textureWidth, textureHeight);
        let offset = new THREE.Vector2(Math.round(imageWidth * t.offset.x), imageHeight - Math.round(imageHeight * t.offset.y) - textureHeight);
        let max = offset.clone().add(v);

        let srcRegion = new THREE.Box2(offset, max);

        // see https://github.com/mrdoob/three.js/issues/28282
        let renderTarget = new THREE.WebGLRenderTarget(textureWidth, textureHeight,
            { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat,
                colorSpace: THREE.SRGBColorSpace
             }
        );

        renderer.initRenderTarget(renderTarget);
        renderer.copyTextureToTexture(t, renderTarget.texture, srcRegion)

        return renderTarget.texture;
    }

}