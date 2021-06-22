
import { observe } from './observe/index'
import { proxy } from './util/index';

export function initState(vm){
    const opt = vm.$options;
    // vue 的数据来源 属性 方法 数据 计算属性 watch
    if (opt.props) {
        initProps(vm);
    }
    if (opt.data) {
        initData(vm);
    }
}

function initData(vm){
    let data = vm.$options.data;

    // data.call(vm) 为了让 data 函数中的 this 指向当前实例 使用了call 方法
    // vm._data 为了使得data 数据能在 外面访问 所以添加在实例上
    data = vm._data = typeof data === 'function' ? data.call(vm):data

    //  实现 MVVM 劫持数据 

    // 为了让用户更好的使用, 我希望能够直接 vm.xxx
    for(let key in data){
        proxy(vm, '_data', key);
    }

    observe(data) // 响应式原理
}