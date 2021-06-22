import { isArray, isInteger } from "../share/index";

export function effect(fn,options:any={}){ //effect => vue2 中的watch
    const effect = createReactiveEffect(fn,options);
    if (!options.lazy) {
        effect()
    }
    return effect;
}


let activeEffect; // 用来存储当前的 effect 函数

let uid= 0;
const effectStack = []
function createReactiveEffect(fn,options){
    const effect = function(){
        if (!effectStack.includes(effect)) { // 防止递归执行
            try {
                activeEffect = effect
                effectStack.push(activeEffect);
                return fn()//用户自己写的逻辑,内部会对数据进行取值操作,在取值的时候 可以拿到 activeEffect 函数
            }finally {
                effectStack.pop();
                activeEffect = effectStack[effectStack.length-1];
            }
        }
        
    }

    effect.id = uid++;
    effect.deps = []; // 用来表示 effect 中依赖了哪些属性
    effect.options = options;
    return effect;
}

// 将属性和 effect 做一个关联

const targetMap = new WeakMap(); // { target:{ key: new Set() } }
export function track(target,key){
    if (activeEffect == undefined) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target,(depsMap = new Map()))
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key,(dep = new Set)) 
    }
    if (!dep.has(activeEffect)) { // 如果没有 effect 就把 effect 放进集合里
        dep.add(activeEffect);
        activeEffect.deps.push(dep); // 双向记忆的过程
    }
    console.log(depsMap);
    
}

export function trigger (target,type,key,value?,oldValue?) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const run = effects => {
        if (effects) {
            effects.forEach(effect => effect())
        }
    }

    // 数组有特殊情况
    if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep,key)=>{
            if (key == 'length' || key >= value) { // 如果该长度 小于数组原有的长度时,应该更新视图
                run(dep)
            }
        })
    }else {
        // 对象的处理
        if (key != void 0) { // 说明修改了 key
            run(depsMap.get(key))
        }

        switch (type) {
            case 'add':
                if (isArray(target)) { // 给数组如果通过索引增加选项
                    if(isInteger(key)){
                        run(depsMap.get('length')); //因为如果页面中直接使用了数组也会对数组进行取值操作, 会对length进行收集,
                                                    // 新增属性时直接触发 length;
                    }
                    
                }
                break;
        
            default:
                break;
        }
    }

    
}