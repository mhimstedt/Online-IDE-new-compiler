import * as THREE from 'three';
import { World3dClass } from "./World3dClass";
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import helvetiker_regular from 'assets/graphics/helvetiker_regular.typeface.json.txt';

type Axis = {
    vector: THREE.Vector3,
    color: number,
    caption: string,
    arrowHelper?: THREE.ArrowHelper,
    mesh?: THREE.Mesh
}

export class CoordinateSystemHelper3d {

    axes: Axis[] = [
        {
            vector: new THREE.Vector3(1, 0, 0),
            color: 0xff0000,
            caption: "x"
        },
        {
            vector: new THREE.Vector3(1, 0, 0),
            color: 0x00ff00,
            caption: "y"
        },
        {
            vector: new THREE.Vector3(1, 0, 0),
            color: 0x2020ff,
            caption: "z"
        },
    ]

    constructor(private world3d: World3dClass) {

    }


    async show(): Promise<CoordinateSystemHelper3d> {
        let origin = new THREE.Vector3(0, 0, 0);

        if (!this.axes[0].arrowHelper) {

            for (let axis of this.axes) {
                axis.arrowHelper = new THREE.ArrowHelper(axis.vector, origin, 1, axis.color);

            }
        }

        for(let axis of this.axes){
            this.world3d.scene.add(axis.arrowHelper!);
        }

        return this;
    }



}