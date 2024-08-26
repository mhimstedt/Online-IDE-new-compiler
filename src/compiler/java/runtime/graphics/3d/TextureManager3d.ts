import * as THREE from 'three';
import spritesheetjson from '/include/graphics/spritesheet.json.txt';
import spritesheetpng from '/include/graphics/spritesheet.png';
import { PixiSpritesheetData } from '../../../../../client/spritemanager/PixiSpritesheetData';

export class TextureManager3d {

    source: THREE.Source;
    image: HTMLImageElement;
    spritesheetData: PixiSpritesheetData;
    renderer: THREE.WebGLRenderer;

    texture: THREE.Texture;
    
    async init(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        
        let pathPraefix: string = "";
        //@ts-ignore
        if (window.javaOnlineDir != null) {
            //@ts-ignore
            pathPraefix = window.javaOnlineDir;
        }
        
        if (pathPraefix.endsWith("/")) {
            pathPraefix = pathPraefix.substring(0, pathPraefix.length - 1);
        }
        
        this.texture = await new THREE.TextureLoader().loadAsync(pathPraefix + spritesheetpng);
        this.texture.colorSpace = THREE.SRGBColorSpace;
        this.texture.magFilter = THREE.NearestFilter;

        this.spritesheetData = await (await fetch(pathPraefix + `${spritesheetjson}`)).json();
        
    }
    
    getTexture(spritesheet: string, index: number) {
        let key: string = spritesheet + "#" + index;
        let frame = this.spritesheetData.frames[key];
        let data = frame.frame;

        let t = this.texture.clone();
        
        t.repeat.set(data.w / this.texture.image.width, data.h / this.texture.image.height);
        t.offset.x = data.x / this.texture.image.width;
        t.offset.y = 1 - data.h / this.texture.image.height - data.y / this.texture.image.height;
        
        t.colorSpace = THREE.SRGBColorSpace;
        t.magFilter = THREE.NearestFilter;

        return t;
    }

}