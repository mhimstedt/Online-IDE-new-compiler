import * as THREE from 'three';
import { World3dClass } from '../World3dClass';



export class FastSpriteManager3d {

    texture: THREE.Texture;
    mesh: THREE.Mesh;
    geometry: THREE.InstancedBufferGeometry;
    material: THREE.ShaderMaterial;

    constructor(private world3d: World3dClass) {

        this.geometry = new THREE.InstancedBufferGeometry();

        this.texture = world3d.textureManager3d.getSpritesheetBasedTexture("Plattforms", 1);

        let ig = new THREE.InstancedBufferGeometry().copy(<THREE.InstancedBufferGeometry><any>new THREE.PlaneGeometry(2, 1));
        ig.instanceCount = Infinity;
        const amount = 120;
        let instPos = new Float32Array(amount * 3);
        for(let i = 0; i < amount;i++){
          instPos[i * 3 + 0] = Math.round(THREE.MathUtils.randFloatSpread(50));
          instPos[i * 3 + 1] = Math.round(THREE.MathUtils.randFloatSpread(50));
          instPos[i * 3 + 2] = Math.round(THREE.MathUtils.randFloatSpread(50));
        }
        ig.setAttribute("instPos", new THREE.InstancedBufferAttribute(instPos, 3));
        
        let im = new THREE.ShaderMaterial({
          uniforms: {
            quaternion: {value: new THREE.Quaternion()},
            markerTexture: {value: this.texture},
            textureDimensions: {value: new THREE.Vector2(32, 64)}
          },
          vertexShader: `
            uniform vec4 quaternion;
            uniform vec2 textureDimensions;
            
            attribute vec3 instPos;
            
            varying vec2 vUv;
            
            vec3 qtransform( vec4 q, vec3 v ){ 
              return v + 2.0*cross(cross(v, q.xyz ) + q.w*v, q.xyz);
            } 
            
            void main(){
              vec3 pos = qtransform(quaternion, position) + instPos;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
              
              float iID = float(gl_InstanceID);
              float stepW = 1. / textureDimensions.x;
              float stepH = 1. / textureDimensions.y;
              
              float uvX = mod(iID, textureDimensions.x);
              float uvY = floor(iID / textureDimensions.x);
              
              vUv = (vec2(uvX, uvY) + uv) * vec2(stepW, stepH);
            }
          `,
          fragmentShader: `
            uniform sampler2D markerTexture;
            
            varying vec2 vUv;
            
            void main(){
              vec4 col = texture(markerTexture, vUv);
              gl_FragColor = vec4(col.rgb, 1);
            }
          `
        })
        this.mesh = new THREE.Mesh(ig, im);
        this.world3d.scene.add(this.mesh);

    }





}