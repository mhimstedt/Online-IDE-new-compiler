import { CallbackFunction } from "../../../../common/interpreter/StepFunction";
import { Thread } from "../../../../common/interpreter/Thread";
import { JRC } from "../../../language/JavaRuntimeLibraryComments";
import { LibraryDeclarations } from "../../../module/libraries/DeclareType";
import { StringClass } from "../javalang/ObjectClassStringClass";
import { Vector2Class } from "./Vector2Class";
import 'reflect-metadata';


function method<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
    //console.log("method: called");
    //console.log(propertyKey + " *** " + Reflect.getMetadata("design:paramtypes", target, propertyKey)[0].name)
      // target.constructor.__javaDeclarations.push(...)
}

export class ComplexClass extends Vector2Class {
    static __javaDeclarations: LibraryDeclarations = [
        { type: "declaration", signature: "class Complex extends Vector2" },

        // { type: "method", signature: "Complex(double x, double y)", native: ComplexClass.prototype._constructor2 },

        { type: "method", signature: "double re()", native: ComplexClass.prototype.re },
        { type: "method", signature: "double im()", native: ComplexClass.prototype.im },
        { type: "method", signature: "Complex conjugate()", native: ComplexClass.prototype.conjugate },
        { type: "method", signature: "static Complex exp(Complex z)", native: ComplexClass.exp },
        { type: "method", signature: "static Complex log(Complex z)", native: ComplexClass.log },
        { type: "method", signature: "double arg()", native: ComplexClass.prototype.arg },
        { type: "method", signature: "Complex times(Complex other)", native: ComplexClass.prototype.times },
        { type: "method", signature: "Complex dividedBy(Complex other)", native: ComplexClass.prototype.dividedBy },

        // TODO sin, cos?

        { type: "method", signature: "String toString()", java: ComplexClass.prototype._mj$toString$String$ }
    ];

    re(): number {
        return this.x
    }

    im(): number {
        return this.y
    }

    conjugate(): ComplexClass {
        return new ComplexClass(this.x, -this.y);
    }

    static exp(z: ComplexClass): ComplexClass {
        const r = Math.exp(z.x);
        return new ComplexClass(r * Math.cos(z.y), r * Math.sin(z.y))
    }

    // principal value of the complex logarithm
    static log(z: ComplexClass): ComplexClass {
        return new ComplexClass(Math.log(z._getLength()), z.arg())
    }

    arg(): number {
        return Math.atan2(this.y, this.x)
    }

    // @method
    times(other: ComplexClass): ComplexClass {
        return new ComplexClass(
            this.x * other.x - this.y * other.y,
            this.x * other.y + this.y * other.x
        )
    }

    dividedBy(other: ComplexClass): ComplexClass {
        return this.times(other.conjugate())._scaledBy(1.0 / (other.x * other.x + other.y * other.y))
    }

    // @method
    xy(a: Vector2Class, b: number, c: string) {

    }

    _mj$toString$String$(t: Thread, callback: CallbackFunction) {
        if (Math.abs(this.y) < 1e-14) {
            t.s.push(new StringClass(this.x.toString()));
        } else if (Math.abs(this.x) < 1e-14) {
            t.s.push(new StringClass(this.y.toString() + "i"));
        } else {
            t.s.push(new StringClass(
                this.x
                + (this.y >= 0 ? " + " : " - ")
                + Math.abs(this.y)
                + "i"
            ));
        }

        if (callback) callback();
    }
}
