'use strict';
/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
signed char: -127...127 (не -128...127; аналогично другие типы)
unsigned char: 0...255 (= 28−1)
signed short: -32767...32767
unsigned short: 0...65535 (= 216−1)
signed int: -32767...32767
unsigned int: 0...65535 (= 216−1)
signed long: -2147483647...2147483647
unsigned long: 0...4294967295 (= 232−1)
signed long long: -9223372036854775807...9223372036854775807
unsigned long long: 0...18446744073709551615 (= 264−1)
*/

/** @typedef {{name:string,type:string}} StructFields */

/** @type {Map<String,JSType | JSStruct>} */
export const JSTypesList = new Map();

export class JSType extends EventTarget {
    #name; #size;
    get name() { return this.name };
    get size() { return this.#size };
    /** @param {CustomEvent} event */
    #setSize(event) { let { detail } = event; this.#size = Number(detail) ?? 0; }
    /** @param {String} name @param {Number?} size */
    constructor(name, size = 0) {
        super();
        if (JSTypesList.has(name)) { throw 'Data type already registered'; };
        this.#name = name;
        this.#size = size;
        this.addEventListener('setSize', this.#setSize);
        JSTypesList.set(this.#name, this);
    }
}

export class JSStruct extends JSType {
    #rootFields;
    /** @param {String} name @param {[StructFields]} ArrayTypes */
    constructor(name, ArrayTypes) {
        super(name, 0);
        this.#rootFields = ArrayTypes.filter((v) => { return (v.name != '' && v.type != '') }).slice().map(v => {
            let itemType = JSTypesList.get(v.type);
            if (itemType.constructor.name == 'JSType' || itemType.constructor.name == 'JSStruct') { v.type = itemType; };
            return v;
        });
        let localTotalSize = 0;
        for (let item of ArrayTypes) {
            if (Object.keys(item).length != 2) { continue; }
            if (item.type.constructor.name == 'JSType' || item.type.constructor.name == 'JSStruct') {
                localTotalSize = localTotalSize + item.type.size;
            };
        };
        this.dispatchEvent(new CustomEvent('setSize', { detail: localTotalSize }));
    }
    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => {
                if (this.#rootFields.length > i) {
                    let localVar = this.#rootFields[i];
                    i++;
                    return { done: false, value: localVar }
                } else {
                    return { done: true }
                }
            }
        }
    }
}

export class JSRegister {
    static type(name, size = 0) { if (!JSTypesList.has(name)) { let localJSType = new JSType(name, size); }; };
    static struct(name, fields) { if (!JSTypesList.has(name)) { let localJSType = new JSStruct(name, fields); }; };
}

export class JSValue extends EventTarget {
    #value; #localView;
    /** @param {ArrayBuffer|Uint8Array} value */
    constructor(value) {
        super();
        this.#value = value;
        this.#localView = new DataView(value.buffer, value.byteOffset,value.byteLength);
    }
    get value() { return new Uint8Array(this.#value,0); };
    get AsUint8() { return this.#localView.getUint8(0); };
    get AsInt8() { return this.#localView.getInt8(0); };
    set AsUint8(value) { return this.#localView.setUint8(0,value); };
    set AsInt8(value) { return this.#localView.setInt8(0,value); };
    get AsUint16() { return this.#localView.getUint16(0); };
    get AsInt16() { return this.#localView.getInt16(0); };
    set AsUint16(value) { return this.#localView.setUint16(0,value); };
    set AsInt16(value) { return this.#localView.setInt16(0,value); };
    get AsUint32() { return this.#localView.getUint32(0); };
    get AsInt32() { return this.#localView.getInt32(0); };
    set AsUint32(value) { return this.#localView.setUint32(0,value); };
    set AsInt32(value) { return this.#localView.setInt32(0,value); };
    get AsUint64() { return this.#localView.getBigUint64(0); };
    get AsInt64() { return this.#localView.getBigInt64(0); };
    set AsUint64(value) { return this.#localView.setBigUint64(0,value); };
    set AsInt64(value) { return this.#localView.setBigInt64(0,value); };
}

export class JSVariable extends EventTarget {
    #localJSTypes; #name; #localMemory;
    constructor(JSTypeName) {
        super();
        if (JSTypesList.has(JSTypeName)) {
            this.#localJSTypes = JSTypesList.get(JSTypeName);
            this.#localMemory = new ArrayBuffer(this.#localJSTypes.size);
            let i = 0;
            for (const { /** @type {String} name */ name, /** @type {JSType|JSStruct} name */ type } of this.#localJSTypes) {
                console.log(`localJSTypes -> `, name, type);
                /** @returns {JSValue} */
                function localGet() {
                    let localTMPArray = Array.from(this.#localJSTypes);
                    let findIndex = localTMPArray.findIndex(v => { return v.name == name; });
                    let calcOffset = 0;
                    for (let index = 0; index <= findIndex; index++) {
                        let element = localTMPArray[index];
                        if (element.name == name){ break; }
                        calcOffset = calcOffset + element.type.size;
                    };
                    let localData = new JSValue(new Uint8Array(this.#localMemory, calcOffset, type.size));
                    return localData;
                };
                let localSet = undefined/*(value) => { }*/;
                i = i + type.size;
                Object.defineProperty(this, name, { get: localGet, set: localSet, enumerable: true });
            }
        }
    }
    getMemory() { return this.#localMemory; }
}