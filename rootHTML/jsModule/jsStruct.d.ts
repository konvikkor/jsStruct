'use strict';
interface StructFields {
    name:string,
    type:string
}
export const JSTypesList = new Map<String,JSType | JSStruct>;

export class JSType extends EventTarget {
    #name; #size;
    get name() { return this.name };
    get size() { return this.#size };
    #setSize(event:CustomEvent) : void;
    constructor(name:String, size = 0)
}

export class JSStruct extends JSType {
    constructor(name:String, ArrayTypes:[StructFields])
    [Symbol.iterator]():Iterable;
}

export class JSRegister {
    static type(name:String, size = 0):void;
    static struct(name:String, fields:Array<JSType|JSStruct>):void;
}

export const JSConfig = {
    littleEndian:true
}

export class JSValue extends EventTarget {
    constructor(value:ArrayBuffer|Uint8Array)
    get value():Uint8Array;
    get AsString():String;
    set AsString(text:String):String;
    get AsUint8():Number;
    get AsInt8():Number;
    set AsUint8(value:Number):Number;
    set AsInt8(value:Number):Number;
    get AsUint16():Number;
    get AsInt16():Number;
    set AsUint16(value:Number):Number;
    set AsInt16(value:Number):Number;
    get AsUint32():Number;
    get AsInt32():Number;
    set AsUint32(value:Number):Number;
    set AsInt32(value:Number):Number;
    get AsUint64():BigInt;
    get AsInt64():BigInt;
    set AsUint64(value:BigInt):BigInt;
    set AsInt64(value:BigInt):BigInt;
}

export class JSVariable extends EventTarget {
    [name:string]:JSValue;
    #localJSTypes; #name; #localMemory;
    constructor(JSTypeName:String);
    /** @returns {ArrayBuffer?} */
    getMemory():ArrayBuffer?;
    setMemory(Memory:ArrayBuffer, byteOffset = 0):JSVariable;
}