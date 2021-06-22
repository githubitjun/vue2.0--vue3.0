
import { arrayMethods } from './array'

import  { def,isObject,proxy } from '../util/index'
class Observer {
    constructor(data){
        // vue如果数据的层次过多 需要递归的去解析对象中的属性，依次增加set和get方法
        // value.__ob__ = this; // 我给每一个监控过的对象都增加一个__ob__属性
        def(data,'__ob__',this)
        // 实现对数组的监听
        if (Array.isArray(data)) {
            // 如果是数组的话并不会对索引进行观测 因为会导致性能问题
            // 前端开发中很少很少 去操作索引 push shift unshift 
            data.__proto__ =  arrayMethods; // 相当于替换了数组实例的原型
            this.observerArray(data)
        }else {
            // 当不是数组, 是对象时;
            this.walk(data)
        }
    }
    walk(data){
        let keys = Object.keys(data);
        keys.forEach((key,index)=>{
            defineReactive(data,key,data[key]);
        })
    }
    observerArray(value){
        for(let i = 0; i < value.length;i++){
            observe(value[i])
        }
    }
}

function defineReactive(data,key,value){
    observe(value); //value 也可能是一个对象
    Object.defineProperty(data,key,{
        get(){
            return value
        },
        set(newValue){
            if (newValue === value) return
            observe(newValue); // 继续劫持用户设置的值，因为有可能用户设置的值是一个对象
            value = newValue;
        }
    })
}

export function observe(data){
    
    // 首先判断是不是一个对象
    if (isObject()) {
        // 说明是一个对象
        new Observer(data)
    }else {
        return
    }
    
}