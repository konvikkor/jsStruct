import { JSRegister, JSStruct, JSType, JSTypesList, JSVariable } from "./jsModule/jsStruct.js";

JSRegister.type('int8',1);
JSRegister.type('int16',2);
JSRegister.type('int32',4);
JSRegister.type('int64',8);
JSRegister.struct('myStruct',[
    {name:'test',type:'int8'},
    {name:'test2',type:'int16'}
]);
console.log(JSTypesList);
let localVar = new JSVariable('myStruct');
console.log(localVar);
console.log(localVar.test,localVar.test.AsInt8);
console.log(localVar.test2,localVar.test2.AsInt8);
localVar.test2.AsInt8 = 255;
localVar.test.AsInt8 = 155;
console.log(localVar.test2,localVar.test);
console.log(localVar.test2.value,localVar.test.value);

