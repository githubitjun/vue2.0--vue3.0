import { isObject } from "../share/index";
import { mutableHandlers } from "./baseHandlers";



export function reactive(target){
    // 我们需要将目标变成响应式的, Proxy
    return creactReactiveObject(target,mutableHandlers); // 核心操作就是当读取文件的时候做依赖收集, 当数据改变时要
    // 重新执行effect 
}


const proxyMap = new WeakMap()

function creactReactiveObject(target,baseHandlers){
    // 如果不是对象直接不理     
    if (!isObject(target)) {
        return target
    }

    const exisitinProxy =proxyMap.get(target);
    if (exisitinProxy) {
        return exisitinProxy
    }

    // 只是对最外层对象做代理, 默认不会递归, 而且不会重新重写对象中的属性
    const proxy = new Proxy(target,baseHandlers);
    proxyMap.set(target,proxy);// 将代理的对象和 代理后的结果 做一个映射表
    return proxy;
}