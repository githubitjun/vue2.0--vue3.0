// 我要重写数组的那些方法 7个 push shift unshift pop reverse sort splice 会导致数组本身发生变化
// slice()

let oldArrayMethods = Array.prototype;

export let arrayMethods = Object.create(oldArrayMethods); // 将原本的数组原型 设置为arrayMethods 的原型

const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'splice',
    'reverse'
]

methods.forEach(method=>{
    arrayMethods[method] = function(...args){
        const result = oldArrayMethods[method].apply(this,args); // 调用原生对应的方法
        // push unshift 添加的元素可能还是一个对象
        let insered; // 获取到 当前用户插 入的数据
        let ob = this.__ob__;
        switch (method){
            case 'push':
            case 'shift':
                insered = args;
                break;
            case 'splice': // 3个  新增的属性 splice 有删除 新增的的功能 arr.splice(0,1,{name:1})
                inserted = args.slice(2)
            default:
                break;
        }
        if (insered) {
            // 如果新增的数据存在 那么我们也要继续监听;  insered 是个数组 那么就要调用监听数组的方法
            ob.observerArray(insered)
        }

        return result;
    }
})