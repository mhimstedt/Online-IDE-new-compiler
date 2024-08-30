import * as THREE from 'three';
import { CallbackParameter } from '../../../../../common/interpreter/CallbackParameter';
import { Thread } from '../../../../../common/interpreter/Thread';
import { ColorHelper } from '../../../../lexer/ColorHelper';
import { LibraryDeclarations } from '../../../../module/libraries/DeclareType';
import { NonPrimitiveType } from '../../../../types/NonPrimitiveType';
import { ColorClass } from '../../ColorClass';
import { Vector3Class } from '../Vector3Class';
import { Light3dClass } from './Light3dClass';

export class PointLight3dClass extends Light3dClass {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class PointLight3d extends Object3d" },
        { type: "method", signature: "PointLight3d()", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$ },
        { type: "method", signature: "PointLight3d(double x,double y,double z)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$ },
        { type: "method", signature: "PointLight3d(double x,double y,double z,int color)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$int$ },
        { type: "method", signature: "PointLight3d(double x,double y,double z,int color,double intensity)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$int$double$ },
        { type: "method", signature: "PointLight3d(double x,double y,double z,String color)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$String$ },
        { type: "method", signature: "PointLight3d(double x,double y,double z,String color,double intensity)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$String$double$ },
        { type: "method", signature: "PointLight3d(double x,double y,double z,Color color)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$Color$ },
        { type: "method", signature: "PointLight3d(double x,double y,double z,Color color,double intensity)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$Color$double$ },
        { type: "method", signature: "PointLight3d(Vector3 position)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$ },
        { type: "method", signature: "PointLight3d(Vector3 position,int color)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$int$ },
        { type: "method", signature: "PointLight3d(Vector3 position,int color,double intensity)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$int$double$ },
        { type: "method", signature: "PointLight3d(Vector3 position,String color)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$String$ },
        { type: "method", signature: "PointLight3d(Vector3 position,String color,double intensity)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$String$double$ },
        { type: "method", signature: "PointLight3d(Vector3 position,Color color)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$Color$ },
        { type: "method", signature: "PointLight3d(Vector3 position,Color color,double intensity)", java: PointLight3dClass.prototype._cj$_constructor_$PointLight3d$double$double$double$Color$double$ },
        { type: "field", signature: "public Material3d material" },
    ];

    static type: NonPrimitiveType;

    _cj$_constructor_$PointLight3d$(t: Thread, callback: CallbackParameter) {
        super._cj$_constructor_$Light3d$(t, () => {
            this.light=new THREE.PointLight();
            if (callback) callback();
        });
    }
    _cj$_constructor_$PointLight3d$double$double$double$(t: Thread, callback: CallbackParameter,x:number,y:number,z:number) {
        this._cj$_constructor_$PointLight3d$(t,callback);
        this.light.position.set(x,y,z);
    }
    _cj$_constructor_$PointLight3d$Vector3$(t: Thread, callback: CallbackParameter,position:Vector3Class) {
        this._cj$_constructor_$PointLight3d$(t,callback);
        this.light.position.set(position.v.x,position.v.y,position.v.z);
    }
    _cj$_constructor_$PointLight3d$Vector3$int$(t: Thread, callback: CallbackParameter,position:Vector3Class,color:number) {
        this._cj$_constructor_$PointLight3d$Vector3$(t,callback,position);
        this.light.color.set(color);
    }
    _cj$_constructor_$PointLight3d$Vector3$String$(t: Thread, callback: CallbackParameter,position:Vector3Class,color:string) {
        this._cj$_constructor_$PointLight3d$Vector3$(t,callback,position);
        let c=ColorHelper.parseColorToOpenGL(color);
        this.light.color.set(c.color);
    }
    _cj$_constructor_$PointLight3d$Vector3$Color$(t: Thread, callback: CallbackParameter,position:Vector3Class,color:ColorClass) {
        this._cj$_constructor_$PointLight3d$Vector3$(t,callback,position);
        this.light.color=new THREE.Color(color.red/255,color.green/255,color.blue/255);
    }
    _cj$_constructor_$PointLight3d$double$double$double$int$(t: Thread, callback: CallbackParameter,x:number,y:number,z:number,color:number) {
        this._cj$_constructor_$PointLight3d$double$double$double$(t,callback,x,y,z);
        this.light.color.set(color);
    }
    _cj$_constructor_$PointLight3d$double$double$double$String$(t: Thread, callback: CallbackParameter,x:number,y:number,z:number,color:string) {
        this._cj$_constructor_$PointLight3d$double$double$double$(t,callback,x,y,z);
        let c=ColorHelper.parseColorToOpenGL(color);
        this.light.color.set(c.color);
    }
    _cj$_constructor_$PointLight3d$double$double$double$Color$(t: Thread, callback: CallbackParameter,x:number,y:number,z:number,color:ColorClass) {
        this._cj$_constructor_$PointLight3d$double$double$double$(t,callback,x,y,z);
        this.light.color=new THREE.Color(color.red/255,color.green/255,color.blue/255);
    }
    _cj$_constructor_$PointLight3d$Vector3$int$double$(t: Thread, callback: CallbackParameter,position:Vector3Class,color:number,intensity:number) {
        this._cj$_constructor_$PointLight3d$Vector3$int$(t,callback,position,color);
        this.light.intensity=intensity;
    }
    _cj$_constructor_$PointLight3d$Vector3$String$double$(t: Thread, callback: CallbackParameter,position:Vector3Class,color:string,intensity:number) {
        this._cj$_constructor_$PointLight3d$Vector3$String$(t,callback,position,color);
        this.light.intensity=intensity;
    }
    _cj$_constructor_$PointLight3d$Vector3$Color$double$(t: Thread, callback: CallbackParameter,position:Vector3Class,color:ColorClass,intensity:number) {
        this._cj$_constructor_$PointLight3d$Vector3$Color$(t,callback,position,color);
        this.light.intensity=intensity;
    }
    _cj$_constructor_$PointLight3d$double$double$double$int$double$(t: Thread, callback: CallbackParameter,x:number,y:number,z:number,color:number,intensity:number) {
        this._cj$_constructor_$PointLight3d$double$double$double$int$(t,callback,x,y,z,color);
        this.light.intensity=intensity;
    }
    _cj$_constructor_$PointLight3d$double$double$double$String$double$(t: Thread, callback: CallbackParameter,x:number,y:number,z:number,color:string,intensity:number) {
        this._cj$_constructor_$PointLight3d$double$double$double$String$(t,callback,x,y,z,color);
        this.light.intensity=intensity;
    }
    _cj$_constructor_$PointLight3d$double$double$double$Color$double$(t: Thread, callback: CallbackParameter,x:number,y:number,z:number,color:ColorClass,intensity:number) {
        this._cj$_constructor_$PointLight3d$double$double$double$Color$(t,callback,x,y,z,color);
        this.light.intensity=intensity;
    }
}