import * as THREE from 'three';
import grassblock from '/include/graphics/robot/grass3d.png';
import { Thread } from '../../../../common/interpreter/Thread';
import { World3dClass } from '../3d/World3dClass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RobotWorldClass } from './RobotWorldClass';
import { TextureManager3d } from '../3d/TextureManager3d';

type TextureData = {
    key: string,
    path: string,
}

export class RobotCubeFactory {

    textureDataList: TextureData[] = [
        { key: "grassblock", path: grassblock }
    ]

    materials: Map<string, THREE.Material> = new Map();

    textureManager3d: TextureManager3d = new TextureManager3d();

    world3d: World3dClass;


    constructor(private robotWorld: RobotWorldClass){
        this.world3d = robotWorld.world3d;
    }

    async init() {
        await this.loadTextures();
        await this.textureManager3d.init(this.world3d.renderer);
    }


    private async loadTextures() {
        const loader = new THREE.TextureLoader();

        let pathPraefix: string = "";
        //@ts-ignore
        if (window.javaOnlineDir != null) {
            //@ts-ignore
            pathPraefix = window.javaOnlineDir;
        }

        if (pathPraefix.endsWith("/")) {
            pathPraefix = pathPraefix.substring(0, pathPraefix.length - 1);
        }

        for (let textureData of this.textureDataList) {
            let texture: THREE.Texture;
            try {
                texture = await loader.loadAsync(pathPraefix + textureData.path);
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.magFilter = THREE.NearestFilter;

            } catch (ex) {
                console.log(ex);
            }
            const material = new THREE.MeshLambertMaterial({
                map: texture,
                side: THREE.DoubleSide

            });
            this.materials.set(textureData.key, material);
        }
    }

    private grassCubeGeometry: THREE.BoxGeometry;
    private getGrassCubeGeometry() {
        if(!this.grassCubeGeometry){
            this.grassCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        
            let uvCoordinates = [
                [1, 1], [2, 1], [1, 0], [2, 0],  // right side
                [1, 1], [2, 1], [1, 0], [2, 0],  // left side
                [2, 1], [3, 1], [2, 0], [3, 0], // top
                [0, 1], [1, 1], [0, 0], [1, 0], // bottom
                [1, 1], [2, 1], [1, 0], [2, 0],  // front
                [1, 1], [2, 1], [1, 0], [2, 0],  // back
            ];
            for (let i = 0; i < uvCoordinates.length; i++) {
                this.grassCubeGeometry.attributes.uv.setXY(i, uvCoordinates[i][0] / 3, uvCoordinates[i][1])
            }
        }
        return this.grassCubeGeometry.clone();
    }

    getGrassCube() {
        // const material = this.materials.get("grassblock");

        const material = new THREE.MeshLambertMaterial({
            map: this.textureManager3d.getTexture("robot", 0),
            side: THREE.DoubleSide
        });


        const cube = new THREE.Mesh(this.getGrassCubeGeometry(), material);
        this.world3d.scene.add(cube);
        return cube;
    }

    getGrassPlane(x: number, y: number){
        for(let i = 0; i < x; i++){
            for(let j = 0; j < y; j++){
                let cube = this.getGrassCube();
                cube.geometry.translate(i - x/2, 0, j - y/2);
            }
        }
    }

} 