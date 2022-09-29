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
class TType {
    #name = undefined;
    get name() { return this.#name.split('\x01')[0]; }
    get size() { return Number(this.#name.split('\x01')[1]).toFixed(0); }
    pointerData = undefined;
    constructor(name, ByteSize = 0) { this.#name = String(name).toLowerCase() + '\x01' + Number(ByteSize).toFixed(0); return this; }
    toString() { return `Size : ${this.name} = ${this.size}`; }
    toJSON() { return JSON.stringify({ size: this.size, name: this.name }); }
}
/**
 * Список типов и их размер
 */
class TTypeList {
    /** @type {Map<String,TType>} */
    #list = new Map();
    /** @param {TType} type @returns {TTypeList}*/
    set add(type) { if (type.constructor.name == 'TType') { this.#list.set(type.name, type); } else { throw "Нужный тип данных TType"; }; return this; }
    constructor() { }
    printList() {
        let printTable = [];
        for (const item of this.#list.keys()) {
            printTable.push({ item: item, size: this.#list.get(item).size })
        }
        console.table(printTable);
    }
    [Symbol.iterator](param) {
        console.log(`iterator:`, param);
        let n = 0;
        let done = false;
        console.log(this.#list.values());
        return {
            next() {
                if (n == 100) { done = true }
                n += 10;
                return { value: n, done: done };
            },
            return() {
                return { done: true };
            }
        };
    }
}
const TypeList = new TTypeList();

let sizeType = 0;
TypeList.add = new TType('void', 0);
sizeType = 1;
for (const typwName of ['byte', 'char', 'TINYINT', 'BOOL', 'BOOLEAN', 'INT1', 'int8', 'uint8']) {
    TypeList.add = new TType(typwName, sizeType);
}
sizeType *= 2; /** 2 */
for (const typwName of ['wchar_t', 'int16', 'uint16', 'short int', 'unsigned short int', 'signed short int']) {
    TypeList.add = new TType(typwName, sizeType);
}
sizeType *= 2; /** 4 */
for (const typwName of ['float', 'int32', 'uint32', 'int', 'unsigned int', 'signed int']) {
    TypeList.add = new TType(typwName, sizeType);
}
sizeType *= 2; /** 8 */
for (const typwName of ['double', 'unsigned long long int', 'long long int', 'unsigned long int', 'signed long int', 'long int']) {
    TypeList.add = new TType(typwName, sizeType);
}
sizeType = 12; /** 12 */
for (const typwName of ['long double']) {
    TypeList.add = new TType(typwName, sizeType);
}
sizeType = undefined;
TypeList.printList();
console.log([...TypeList]);

class TStruct extends EventTarget {
    constructor(name = '') {
        super();
    }
    new() { }
}

export const struct = new TStruct();