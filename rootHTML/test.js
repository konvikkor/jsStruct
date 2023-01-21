import { JSStruct, JSType, JSTypesList } from "./jsModule/jsStruct.js";

let test1JSType = new JSType('int8',1);
console.log(test1JSType,test1JSType.size);
let test2JSType = new JSType('int16',2);
console.log(test2JSType,test2JSType.size);
let test3JSType = new JSType('int32',4);
console.log(test3JSType,test3JSType.size);
let test4JSType = new JSType('int64',8);
console.log(test4JSType,test4JSType.size);

let testJSStruct = new JSStruct('myStruct',[
    {name:'test',type:'int8'},
    {name:'test2',type:'int16'}
]);
console.log(testJSStruct, testJSStruct.size);
console.log(JSTypesList);
for (const item of testJSStruct) {
    console.log(item)
}