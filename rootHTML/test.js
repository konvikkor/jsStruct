import { JSRegister, JSStruct, JSType, JSTypesList, JSValue, JSVariable } from "./jsModule/jsStruct.js";
/** 
 * Для примера будем рассматривать картинки
 * создание типов данных
 */
JSRegister.type('int8', 1);
JSRegister.type('int16', 2);
JSRegister.type('int32', 4);
JSRegister.type('int64', 8);
JSRegister.struct('Bitmap', [
    { name: 'identify', type: 'int16' },
    { name: 'size', type: 'int32' },
    { name: 'Reserved', type: 'int32' },
    { name: 'starting address', type: 'int32' }
]);
JSRegister.struct('DIB_BM', [
    { name: 'core header', type: 'BITMAPCOREHEADER' }
]);
JSRegister.struct('DIB_BA', [
    { name: 'core header', type: 'BITMAPCOREHEADER' }
]);
JSRegister.struct('DIB_CI', [
    { name: 'core header', type: 'BITMAPCOREHEADER' }
]);
JSRegister.struct('DIB_CP', [
    { name: 'core header', type: 'BITMAPCOREHEADER' }
]);
JSRegister.struct('DIB_IC', [
    { name: 'core header', type: 'BITMAPCOREHEADER' }
]);
JSRegister.struct('DIB_PT', [
    { name: 'core header', type: 'BITMAPCOREHEADER' }
]);
var GlobalFile;
/** @type {JSVariable} */
let BMP_HEADER = new JSVariable('Bitmap');
/** @type {HTMLInputElement} */
let inputFile = document.querySelector('input#testFile');
inputFile.addEventListener('change', async (localEvent) => {
    /** @type {HTMLInputElement} */
    let target = localEvent.target;
    /** @type {FileList} */
    let [firstFile] = target.files;
    GlobalFile = await firstFile.arrayBuffer();
    BMP_HEADER.setMemory(GlobalFile);
    for (const item of Object.keys(BMP_HEADER)) {
        switch (item) {
            case 'identify': console.log(item, BMP_HEADER[item].AsString); break;
            case 'size': console.log(item, BMP_HEADER[item].AsUint32); break;
            case 'Reserved': console.log(item, BMP_HEADER[item].AsUint32); break;
            case 'starting address': console.log(item, BMP_HEADER[item].AsUint32); break;
            default: console.log(item, BMP_HEADER[item].value); break;
        }
    };
})

