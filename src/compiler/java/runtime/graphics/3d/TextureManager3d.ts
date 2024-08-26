import * as THREE from 'three';
import spritesheetjson from '/include/graphics/spritesheet.json.txt';
import spritesheetpng from '/include/graphics/spritesheet.png';
import { PixiSpritesheetData } from '../../../../../client/spritemanager/PixiSpritesheetData';

export class TextureManager3d {

    texture: THREE.Texture;
    spritesheetData: PixiSpritesheetData;
    renderer: THREE.WebGLRenderer;
    webGLTexture: WebGLTexture | null;

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

        const loader = new THREE.TextureLoader();
        this.texture = await loader.loadAsync(pathPraefix + `${spritesheetpng}`);
        this.texture.colorSpace = THREE.SRGBColorSpace;
        this.texture.magFilter = THREE.NearestFilter;

        this.spritesheetData = await (await fetch(pathPraefix + `${spritesheetjson}`)).json();


        let gl = renderer.getContext();
        this.webGLTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.webGLTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    getTexture(spritesheet: string, index: number) {
        let key: string = spritesheet + "#" + index;
        let frame = this.spritesheetData.frames[key];
        let data = frame.frame;

        let image = this.texture.image;

        let t = new THREE.Texture();
        t.colorSpace = THREE.LinearSRGBColorSpace;
        t.magFilter = THREE.NearestFilter;
        
        t.repeat.set(data.w / image.width, data.h / image.height);
        t.offset.x = data.x / image.width;
        t.offset.y = 1 - data.h / image.height - data.y / image.height;
        
        let textureProperties = this.renderer.properties.get(t);
        textureProperties.__webglTexture = this.webGLTexture;
        textureProperties.__webglInit = true;

        return t;
    }

}