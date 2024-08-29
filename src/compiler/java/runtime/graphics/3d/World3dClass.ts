
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { DOM } from '../../../../../tools/DOM';
import { CallbackParameter } from '../../../../common/interpreter/CallbackParameter';
import { Interpreter } from '../../../../common/interpreter/Interpreter';
import { Thread, ThreadState } from '../../../../common/interpreter/Thread';
import { JRC } from '../../../language/JavaRuntimeLibraryComments';
import { LibraryDeclarations } from '../../../module/libraries/DeclareType';
import { NonPrimitiveType } from '../../../types/NonPrimitiveType';
import { ObjectClass } from '../../system/javalang/ObjectClassStringClass';
import { ActorManager } from '../ActorManager';
import { ActorType, IActor } from '../IActor';
import { MouseManager } from '../MouseManager';
import { IWorld3d } from './IWorld3d';
import { GraphicSystem } from '../../../../common/interpreter/GraphicsManager';
import { ColorHelper } from '../../../lexer/ColorHelper';
import { ColorClass } from '../ColorClass';
import { NullPointerExceptionClass } from '../../system/javalang/NullPointerExceptionClass';
import { TextureManager3d } from './TextureManager3d';
import { Object3dClass } from './Object3dClass';
import { CoordinateSystemHelper3d } from './CoordinateSystemHelper3d';


export class World3dClass extends ObjectClass implements IWorld3d, GraphicSystem {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class World3d" },

        { type: "method", signature: "World3d()", java: World3dClass.prototype._cj$_constructor_$World$ },

        { type: "method", signature: "void setBackgroundColor(int colorAsRGBInt)", native: World3dClass.prototype._setBackgroundColor, comment: JRC.worldSetBackgroundColorIntComment },
        { type: "method", signature: "void setBackgroundColor(String colorAsString)", native: World3dClass.prototype._setBackgroundColor, comment: JRC.worldSetBackgroundColorStringComment },
        { type: "method", signature: "void setBackgroundColor(Color colorObject)", native: World3dClass.prototype._setBackgroundColor, comment: JRC.worldSetBackgroundColorStringComment },

        { type: "method", signature: "void setCursor(string cursor)", native: World3dClass.prototype._setCursor, comment: JRC.worldSetCursorComment },
        { type: "method", signature: "void clear()", native: World3dClass.prototype._clear, comment: JRC.worldClearComment },

        { type: "method", signature: "void addMouseListener(MouseListener mouseListener)", template: `§1.mouseListener.addMouseListener(§2);`, comment: JRC.worldAddMouseListenerComment },

    ]

    static type: NonPrimitiveType;

    interpreter!: Interpreter;

    width: number = 800;
    height: number = 600;

    graphicsDiv?: HTMLDivElement;
    resizeObserver?: ResizeObserver;

    actorManager!: ActorManager;

    mouseManager!: MouseManager;

    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    orbitControls: OrbitControls;

    objects:Object3dClass[]=[];

    textureManager3d: TextureManager3d;

    coordinateSystemHelper: CoordinateSystemHelper3d;

    _cj$_constructor_$World$(t: Thread, callback: CallbackParameter) {

        let interpreter = t.scheduler.interpreter;

        interpreter.eventManager.once("resetRuntime", () => {
            this.destroyWorld(interpreter);
        })

        interpreter.graphicsManager?.registerGraphicSystem(this);

        let existingWorld = <World3dClass>interpreter.retrieveObject("World3dClass");
        if (existingWorld) {
            t.s.push(existingWorld);
            return existingWorld;
        }

        interpreter.storeObject("World3dClass", this);

        this.actorManager = new ActorManager(interpreter);


        let graphicsDivParent = <HTMLDivElement>interpreter.graphicsManager?.graphicsDiv;
        graphicsDivParent.innerHTML = "";

        this.graphicsDiv = DOM.makeDiv(graphicsDivParent, 'world3d');

        this.graphicsDiv.style.overflow = "hidden";
        this.graphicsDiv.innerHTML = "";
        this.changeResolution(this.width, this.height);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        // size of 1 pixel: see https://discourse.threejs.org/t/solved-how-do-we-size-something-using-screen-pixels/1177

        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setSize(this.width, this.height);
        this.graphicsDiv.appendChild(this.renderer.domElement);

        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";

        this.camera.position.set(2,2,2);
        this.camera.lookAt(new THREE.Vector3(0,0,0));


        let animate = () => {
            this.renderer.render(this.scene, this.camera);
        }
        this.renderer.setAnimationLoop(animate);

        this.resizeObserver = new ResizeObserver(() => {
            this.changeResolution(this.width, this.height);
        });

        this.resizeObserver.observe(this.graphicsDiv!.parentElement!.parentElement!);

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        
        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(10, 5, 3);
        this.scene.add(light);
        const light2 = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light2);
        
        this.scene.background = new THREE.Color(0, 0, 0);
        
        // interpreter.isExternalTimer = true;
        this.addCallbacks(interpreter);
        
        // this.mouseManager = new MouseManager(this);
        
        
        this.textureManager3d = new TextureManager3d();
        
        t.state = ThreadState.waiting;
        this.textureManager3d.init(interpreter).then(() => {
            this.coordinateSystemHelper = new CoordinateSystemHelper3d(this).show();
            t.state = ThreadState.runnable;
            t.s.push(this);
            if (callback) callback();
        })

    }

    tick(elapsedMS: number, interpreter: Interpreter) {
        this.actorManager.callActMethods(33);
        interpreter.timerFunction(33);
    }

    addCallbacks(interpreter: Interpreter) {
        let onResetRuntimeCallback = () => {
            interpreter.deleteObject("World3dClass");
            interpreter.eventManager.off(onResetRuntimeCallback);
            interpreter.eventManager.off(onProgramStoppedCallback);
            this.destroyWorld(interpreter);
        }

        let onProgramStoppedCallback = () => {
            this.onProgramStopped();
            interpreter.eventManager.off(onProgramStoppedCallback);
            // this.mouseManager.unregisterListeners();
        }

        interpreter.eventManager.on("resetRuntime", onResetRuntimeCallback)
        interpreter.eventManager.on("stop", onProgramStoppedCallback)

    }

    destroyWorld(interpreter: Interpreter) {
        this.objects.forEach(obj => obj.destroy());
        this.resizeObserver?.disconnect();
    }

    changeResolution(width: number, height: number) {
        this.width = width;
        this.height = height;

        // prevent graphicsDiv from overflowing
        // this.app!.canvas.style.width = "10px";
        // this.app!.canvas.style.height = "10px";

        // this.app?.renderer.resize(width, height, 1);

        let rect = this.graphicsDiv!.parentElement!.parentElement!.getBoundingClientRect();
        if (rect.width == 0 || rect.height == 0) rect = this.graphicsDiv!.parentElement!.getBoundingClientRect();

        let newCanvasWidth: number;
        let newCanvasHeight: number;
        if (width / height > rect.width / rect.height) {
            newCanvasWidth = rect.width;
            newCanvasHeight = rect.width / width * height;
        } else {
            newCanvasHeight = rect.height;
            newCanvasWidth = rect.height / height * width;
        }

        newCanvasHeight = Math.min(newCanvasHeight, rect.height);
        newCanvasWidth = Math.min(newCanvasWidth, rect.width);

        // this.graphicsDiv.style.width = newCanvasWidth + "px";
        // this.graphicsDiv.style.height = newCanvasHeight + "px";

        this.camera?.updateProjectionMatrix();
        this.renderer?.setSize(newCanvasWidth, newCanvasHeight);

        // this.app!.canvas.style.width = newCanvasWidth + "px";
        // this.app!.canvas.style.height = newCanvasHeight + "px";

    }

    onProgramStopped() {
        // TODO: Render to bitmap and set bitmap instead of webgl-canvas


    }

    registerActor(actor: IActor, type: ActorType): void {
        this.actorManager.registerActor(actor, type);
    }

    unregisterActor(actor: IActor): void {
        this.actorManager.unregisterActor(actor);
    }

    hasActors(): boolean {
        return this.actorManager.hasActors();
    }


    _setBackgroundColor(color: string | number | ColorClass) {
        // let renderer = (<PIXI.Renderer>(this.app.renderer));
        // if (typeof color == "string") {
        //     let c = ColorHelper.parseColorToOpenGL(color);
        //     if (!c.color) return;
        //     renderer.background.color.setValue(c.color);
        // } else {
        //     renderer.background.color.setValue(color);
        // }
        if(color===null){
            throw new NullPointerExceptionClass(JRC.world3dColorNull())
        }
        if(typeof color==="number"){
            this.scene.background=new THREE.Color(color);
        }
        if(typeof color==="string"){
            let c = ColorHelper.parseColorToOpenGL(color);
            this.scene.background=new THREE.Color(c.color);
        }
        if(typeof color==="object"){
            this.scene.background=new THREE.Color(color.red,color.green,color.blue);
        }
    }


    _setCursor(cursor: string) {
        this.graphicsDiv.style.cursor = cursor;
    }

    _clear() {
        this.objects.forEach((o)=>{
            o.destroy();
        })
        this.scene.clear();
        //TODO: set all Object3d-instances to destroyed
    }

    getIdentifier(): string {
        return "World3d";
    }

}

