import { isSymbol, isObject, isInteger,isArray,hasOwn, hasChanged } from "../share/index";

import {reactive } from './reactive'
import { track, trigger } from "./effect";


function createGetter(){
    return function get(target,key,receiver){
        const res = Reflect.get(target,key,receiver); // target[key]
        if (isSymbol(key)) { // 数组中有很多 symbol 的内置方法
            return res;
        }
        track(target,key)
        // 依赖收集
        console.log('此时数据做了获取的操作');
        
        if (isObject(res)) { // 取值是对象再进行递归, 2.0 里面是一上来所有的都递归, 这是懒递归
            return reactive(res)
        }
        return res
    }
}

function createSetter(){
    return function set(target,key,value,receiver){

        // 新增还是修改?
        const oldValue = target[key];// 如果是修改肯定有老值
        // 看一下有没有这个属性

        // 第一种是 数组新增的逻辑   第二种是对象的逻辑
        const hadKey = isArray(target) && isInteger(key) ? Number(key) <target.length : hasOwn(target,key)
        



       const result =  Reflect.set(target,key,value,receiver); 

       if (!hadKey) {
           console.log('新增属性');
           trigger(target,'add',key,value)
           
       }else if(hasChanged(value,oldValue)){
           console.log('修改属性');
           trigger(target,'set',key,value,oldValue)
       }


       return result;
    }
}

const get = createGetter();
const set = createSetter();



export const mutableHandlers = {
    get,// 获取对象中的属性会执行此方法
    set,//设置属性值的时候回触发
}