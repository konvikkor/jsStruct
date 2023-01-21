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

/**
 * @typedef {{name:string,type:string}} StructFields
 */

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
                    return { done: true}
                }
            }
        }
    }
}

export class JSRegister {
    static type(name, size = 0) { }
    static struct(name, fields) { }
}

export class JSVariable extends EventTarget {
    #localJSTypes; #name;
    constructor(variableName, JSTypeName) {
        super();
        this.#name = variableName;
        if (JSTypesList.has(JSTypeName)) {
            this.#localJSTypes = JSTypesList.get(JSTypeName);
        }
    }
}