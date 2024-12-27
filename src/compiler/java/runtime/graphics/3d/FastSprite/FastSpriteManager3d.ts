import * as THREE from 'three';
import { World3dClass } from '../World3dClass';
import { SpriteLibraryEnum } from '../../SpriteLibraryEnum';
import { RuntimeExceptionClass } from '../../../system/javalang/RuntimeException';



export type FastSprite = {
    index: number;
}

export class FastSpriteManager3d {

    texture: THREE.Texture;
    mesh: THREE.Mesh;
    geometry: THREE.InstancedBufferGeometry;
    material: THREE.ShaderMaterial;

    maxCount: number = 200;

    offsets: Float32Array = new Float32Array(this.maxCount * 3);
    sizes: Float32Array = new Float32Array(this.maxCount * 2);          // width, height in pixels
    uvBoxes: Float32Array = new Float32Array(this.maxCount * 4);   // left, bottom, widht, height
    rotations: Float32Array = new Float32Array(this.maxCount * 1);   // rotation in radians
    colors: Float32Array = new Float32Array(this.maxCount * 3);   // rotation in radians
    alphas: Float32Array = new Float32Array(this.maxCount * 1);   // rotation in radians

    offsetAttribute: THREE.InstancedBufferAttribute;
    sizeAttribute: THREE.InstancedBufferAttribute;
    uvBoxAttribute: THREE.InstancedBufferAttribute;
    rotationAttribute: THREE.InstancedBufferAttribute;
    colorAttribute: THREE.InstancedBufferAttribute;
    alphaAttribute: THREE.InstancedBufferAttribute;

    fastsprites: FastSprite[] = [];

    constructor(private world3d: World3dClass) {

        this.texture = world3d.textureManager3d.getSpritesheetBasedTexture("Plattforms", 1);
        this.initMesh();

    }

    initMesh(oldInstanceCount: number = 0){
        this.geometry = new THREE.InstancedBufferGeometry();
        //cubeGeo.maxInstancedCount = 8;
        const positions = [0.5, 0.5, 0, -0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0];
        const rawUVs = [1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0];

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('rawUV', new THREE.Float32BufferAttribute(rawUVs, 2));

        this.geometry.setAttribute('offset', this.offsetAttribute = new THREE.InstancedBufferAttribute(this.offsets, 3));
        this.geometry.setAttribute('size', this.sizeAttribute = new THREE.InstancedBufferAttribute(this.sizes, 2));
        this.geometry.setAttribute('uvBox', this.uvBoxAttribute = new THREE.InstancedBufferAttribute(this.uvBoxes, 4));
        this.geometry.setAttribute('rotation', this.rotationAttribute = new THREE.InstancedBufferAttribute(this.rotations, 4));
        this.geometry.setAttribute('color', this.colorAttribute = new THREE.InstancedBufferAttribute(this.colors, 4));
        this.geometry.setAttribute('alpha', this.alphaAttribute = new THREE.InstancedBufferAttribute(this.alphas, 4));

        this.geometry.instanceCount = oldInstanceCount;


        var mat = new THREE.RawShaderMaterial({
            uniforms: { mtexture: { value: this.texture } },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            side: THREE.FrontSide,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, mat);
        this.world3d.scene.add(this.mesh);

    }

    getVertexShader(): string {
        return `
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        
        attribute vec3 position;
        attribute vec2 rawUV;
        attribute vec3 offset;
        attribute vec2 size;
        attribute vec4 uvBox;
        attribute float rotation;

        varying vec2 vUV;
        
        void main() {
         vUV = uvBox.xy + rawUV * vec2(uvBox.z, uvBox.w); // uvBox.zw;

         vec4 mvPosition = modelViewMatrix[ 3 ];

          vec2 rotatedPosition;
          rotatedPosition.x = cos( rotation ) * position.x - sin( rotation ) * position.y;
          rotatedPosition.y = sin( rotation ) * position.x + cos( rotation ) * position.y;

         mvPosition.xy = mvPosition.xy + rotatedPosition.xy * size;

         gl_Position = projectionMatrix * (mvPosition + modelViewMatrix * vec4(offset, 0.0));

         // vec4 mvPosition = modelViewMatrix * vec4(position * size, 1.0);

         //gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + position * size, 1.0 );
        
        }
        `

    }

    getFragmentShader(): string {
        return `
        precision mediump float;
        uniform sampler2D mtexture;
        //attribute vec3 color;
        //attribute float alpha;

        varying vec2 vUV;
        
        void main() {
         vec4 col = texture2D(mtexture, vUV); // * vec4(color, alpha);
         gl_FragColor = col;
        
        }
    `;

    }

    getSprite(width: number, library: SpriteLibraryEnum, index: number): FastSprite {
        let textureFrame = this.world3d.textureManager3d.getFrame(library.name, index);
        if (!textureFrame) {
            throw new RuntimeExceptionClass("Didn't find sprite " + index + " in library " + library.name + ".");
        }

        let frame = textureFrame.frame;

        let W: number = 1024;
        let H: number = 1024;
        if (textureFrame.isSystemSpritesheet) {
            W = this.texture.image.width;
            H = this.texture.image.height;
        }
        let wFraction = frame.w / W;
        let hFraction = frame.h / H;
        let xStart = frame.x / W;
        let yStart = 1 - frame.y / H - hFraction;

        if (this.geometry.instanceCount >= this.maxCount) {
            this.resizeBuffers();
        }

        let nfi = this.geometry.instanceCount;
        let fs: FastSprite = {
            index: nfi
        }

        this.geometry.instanceCount++;

        this.offsets[nfi * 3] = 0;
        this.offsets[nfi * 3 + 1] = 0;
        this.offsets[nfi * 3 + 2] = 0;

        this.sizes[nfi * 2] = width;
        this.sizes[nfi * 2 + 1] = frame.h / frame.w * width;

        this.uvBoxes[nfi * 4] = xStart;
        this.uvBoxes[nfi * 4 + 1] = yStart;
        this.uvBoxes[nfi * 4 + 2] = wFraction;
        this.uvBoxes[nfi * 4 + 3] = hFraction;

        this.rotations[nfi] = 0;

        this.colors[nfi * 3] = 1;
        this.colors[nfi * 3 + 1] = 1;
        this.colors[nfi * 3 + 2] = 1;

        this.alphas[nfi * 3 + 2] = 1;


        this.offsetAttribute.needsUpdate = true;
        this.sizeAttribute.needsUpdate = true;
        this.uvBoxAttribute.needsUpdate = true;

        this.fastsprites.push(fs);

        return fs;

    }


    resizeBuffers() {
        this.maxCount *= 3;
        const newOffsets = new Float32Array(this.maxCount * 3);
        newOffsets.set(this.offsets);
        this.offsets = newOffsets;
        const newSizes = new Float32Array(this.maxCount * 2);
        newSizes.set(this.sizes);
        this.sizes = newSizes;
        const newUvBoxes = new Float32Array(this.maxCount * 4);
        newUvBoxes.set(this.uvBoxes);
        this.uvBoxes = newUvBoxes;
        const newRotations = new Float32Array(this.maxCount * 1);
        newRotations.set(this.rotations);
        this.rotations = newRotations;
        const newColors = new Float32Array(this.maxCount * 3);
        newColors.set(this.colors);
        this.colors = newColors;
        const newAlphas = new Float32Array(this.maxCount * 1);
        newAlphas.set(this.alphas);
        this.alphas = newAlphas;


        let oldInstanceCount: number = 0;
        if(this.mesh){
            oldInstanceCount = this.geometry.instanceCount;
            this.world3d.scene.remove(this.mesh);
            (<THREE.Material>this.mesh.material).dispose();
            (<THREE.InstancedBufferGeometry>this.mesh.geometry).dispose();
        }

        this.initMesh(oldInstanceCount);

    }


    removeSprite(fastSprite: FastSprite){
        
        if(fastSprite.index < this.geometry.instanceCount - 1){
            const lastFastSprite = this.fastsprites.pop();
            const lastIndex = this.geometry.instanceCount - 1;
            lastFastSprite.index = fastSprite.index;
            this.fastsprites[fastSprite.index] = lastFastSprite;
    
            this.offsets.copyWithin(fastSprite.index * 3, lastIndex * 3, lastIndex * 3 + 3);
            this.sizes.copyWithin(fastSprite.index * 2, lastIndex * 2, lastIndex * 2 + 2);
            this.uvBoxes.copyWithin(fastSprite.index * 4, lastIndex * 4, lastIndex * 4 + 4);
            this.rotations.copyWithin(fastSprite.index * 1, lastIndex * 1, lastIndex * 1 + 1);
            this.alphas.copyWithin(fastSprite.index * 1, lastIndex * 1, lastIndex * 1 + 1);
            this.colors.copyWithin(fastSprite.index * 3, lastIndex * 3, lastIndex * 3 + 3);
        }

        this.geometry.instanceCount--;
    }

    moveSprite(fastSprite: FastSprite, x: number, y: number, z: number){
        let baseIndex = fastSprite.index * 3;
        this.offsets[baseIndex] = this.offsets[baseIndex] + x;
        this.offsets[baseIndex + 1] = this.offsets[baseIndex + 1] + y;
        this.offsets[baseIndex + 2] = this.offsets[baseIndex + 2] + z;
        this.offsetAttribute.needsUpdate = true;
    }

    moveSpriteTo(fastSprite: FastSprite, x: number, y: number, z: number){
        let baseIndex = fastSprite.index * 3;
        this.offsets[baseIndex] = x;
        this.offsets[baseIndex + 1] = y;
        this.offsets[baseIndex + 2] = z;
        this.offsetAttribute.needsUpdate = true;
    }

    getX(fastSprite: FastSprite){
        return this.offsets[fastSprite.index * 3];
    }

    getY(fastSprite: FastSprite){
        return this.offsets[fastSprite.index * 3 + 1];
    }

    getZ(fastSprite: FastSprite){
        return this.offsets[fastSprite.index * 3 + 2];
    }

    sort(){
        let cameraPosition = this.world3d.currentCamera.camera3d.position;
    }

}