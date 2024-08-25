import * as THREE from 'three';
import grassblock from '/include/graphics/robot/grass3d.png';

type TextureData = {
    key: string,
    path: string,
}

export class RobotCubeFactory {

    textureDataList: TextureData[] = [
        {key: "grassblock", path: grassblock}
    ]

    material: Map<string, THREE.MeshBasicMaterial> = new Map();


    async loadTextures(){
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
    
        for(let textureData of this.textureDataList){
            let texture: THREE.Texture;
            try {
                texture = await loader.loadAsync(pathPraefix + textureData.path);
            } catch (ex){
                console.log(ex);
            }
            const material = new THREE.MeshBasicMaterial( {
                map: texture,
                
             } );
             this.material.set(textureData.key, material);
        }
    }



} 