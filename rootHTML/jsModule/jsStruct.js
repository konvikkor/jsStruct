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

/** @type {Map<String,JSType | JSStruct>} */
var GlobalListTypes = new Map();

export class JSType extends EventTarget {
    #name; #size;
    get name() { return this.name };
    get size() { return this.#size };
    /** @param {CustomEvent} event */
    #setSize(event) {
        let { detail } = event;
        this.#size = Number(detail) ?? 0;
    }
    /** @param {String} name @param {Number?} size */
    constructor(name, size = 0) {
        super();
        if (GlobalListTypes.has(name)){ throw 'Data type already registered'; };
        this.#name = name;
        this.#size = size;
        this.addEventListener('setSize', this.#setSize);
        GlobalListTypes.set(this.#name, this);
    }
}

export class JSStruct extends JSType {
    #rootFields;
    /** @param {String} name @param {[JSType|JSStruct]} ArrayTypes */
    constructor(name, ArrayTypes) {
        super(name, 0);
        this.#rootFields = ArrayTypes.slice();
        let localTotalSize = 0;
        for (const itemType of ArrayTypes) {
            if (itemType.constructor.name == 'JSType' || itemType.constructor.name == 'JSStruct') {
                localTotalSize = localTotalSize + itemType.size;
            };
        };
        this.dispatchEvent(new CustomEvent('setSize', { detail: localTotalSize }));
    }
}