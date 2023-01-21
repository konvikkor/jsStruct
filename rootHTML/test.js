import { JSStruct, JSType } from "./jsModule/jsStruct.js";

let test1JSType = new JSType('int8',1);
console.log(test1JSType,test1JSType.size);
let test2JSType = new JSType('int16',2);
console.log(test2JSType,test2JSType.size);

let testJSStruct = new JSStruct('myStruct',[test1JSType,test2JSType]);
console.log(testJSStruct, testJSStruct.size);