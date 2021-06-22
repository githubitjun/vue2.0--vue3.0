import applyMixin from './mixin';
import { forEach } from './unit'
import ModuleCollection from './module/module-collection';



let Vue = null;


function getState(store,path){
  return  path.reduce((newState,current)=>{
        return newState[current]
    },store.state)
}

function installModule(store,rootState,path,module){

    let namespace  = store._modules.getNamespace(path)
   
    if (path.length > 0) { // 如果是子模块我们需要将 子模块的状态定义到根模块上面

        let parent = path.slice(0, -1).reduce((memo,current)=>{
            return memo[current]
        },rootState)



        // 可以新增响应式的数据,  如果对象本身不是响应式的 会直接赋值
        store._withCommitting(()=>{
            Vue.set(parent,path[path.length -1 ],module.state);
        })
       
    }


    module.forEachMutation((mutation,type)=>{
        store._mutations[namespace+type] = (store._mutations[namespace+type] || [])
        store._mutations[namespace+type].push((payload)=>{

            store._withCommitting(()=>{
                mutation.call(store,getState(store,path),payload)
            })

            
            // 调用订阅的事件 重新执行
            store._subsrcibers.forEach(sub=>{
                sub({mutation},store.state)
            })

        })
    });
    module.forEachAction((action,type)=>{
        store._actions[namespace+type] = (store._actions[namespace+type] || [])
        store._actions[namespace+type].push((payload)=>{
            action.call(store,store,payload)
        })

    });
    module.forEachGetters((getter,key)=>{
        store._wrappedGetters[namespace+key]  = function(){
        
            return getter(getState(store,path))
        }
    });
    module.forEachChild((child,key)=>{
        installModule(store,rootState,path.concat(key),child)
    })
}

function resetStoreVm(store,state){
    const wrappedGetters = store._wrappedGetters;

    let oldVm = store._vm

    let computed = {}
    store.getters= {}
    forEach(wrappedGetters,(fn,key)=>{
        computed[key] = function(){
            return fn(store.state)
        }
        Object.defineProperty(store.getters,key,{
            get:() => store._vm[key]
        })
    })

    store._vm = new Vue({
        data:{
            $$state:state
        },
        computed
    })

    if (store.strict) {
        // 只要状态一改变就会立即执行, 在状态变化后同步执行
        store._vm.$watch(()=>store._vm._data.$$state,()=>{
            console.assert(store._committing,'在mutations之外更改了状态')
        },{ deep:true, sync:true })
    }


    if (oldVm) {
        Vue.nextTick(()=> oldVm.destroyed )
    }
}


class Store {
    constructor (options){

        // 收集模块转换成一棵树
        this._modules = new ModuleCollection(options);
        // 安装模块 将模块上的属性 定义在我们的 store 中

        let state = this._modules.root.state; // 根的状态

        this._subsrcibers = []

        this._mutations ={};// 存放所有模块的 mutations
        this._actions = {}
        this._wrappedGetters = {}

        this.strict = options.strict; // 为true 为严格模式

        // 同步的 watcher 

        this._committing = false



        installModule(this,state,[],this._modules.root)

        // console.log(this._mutations);
        // console.log(this._actions);
        // console.log(this._wrappedGetters);
        // console.log(this._modules.root.state);

        // 将状态放在vue 的实例中
        resetStoreVm(this,state)

        options.plugins.forEach(plugins => plugins(this))

        /** 
        let state = options.state;
        // 这里能拿到 new Vuex.Store({}) 传过来的 参数对象{}
        // this.state = options.state; // 如果直接将 state 定义在实例上, 稍后这个状态发生改变 视图是不会更新的
        this.getters = {}

        const computed = {}
        forEach(options.getters,(fn,key)=>{
            computed[key] = ()=>{
                return fn(this.state)
            }
            Object.defineProperty(this.getters,key,{
                get:()=> this._vm[key]
            })
        })


        // vue 中定义数据 属性名是有特点的 如果属性名是通过 $xxx 命名的  他不会被代理到 vue 的实例上
        this._vm = new Vue({
            data:{
                $$state:state
            },
            computed // 计算属性会将自己的属性放到实例上
        })
        this._mutations = {}
        forEach(options.mutations,(fn,type)=>{
            this._mutations[type] = (payload)=> fn.call(this,this.state,payload)
        })

        this._actions = {}
        forEach(options.actions,(fn,type)=>{
            this._actions[type] = (payload)=> fn.call(this,this,payload)
        })
           */
    }
    _withCommitting(fn){
        let committing =this._committing
        this._committing = true // 在函数调用之前 表示 _committing 为ture
        fn()
        this._committing = committing;
    }
    subscribe(fn){
        this._subsrcibers.push(fn)
    }
    replaceState(newState){
        this._withCommitting(()=>{
            this._vm._data.$$state = newState
        })
       
    }
    commit = (type,payload)=>{
        this._mutations[type].forEach(fn => {
            return fn(payload)
        })
    }
    dispatch = (type,payload) =>{
        this._actions[type].forEach(fn => {
            return fn(payload)
        })
    }


    // 类的属性访问器 当用户去这个实例上去 state 属性是  会执行此方法
    get state(){
        return this._vm._data.$$state
    }
    
    // 新模块注册
    registerModule(path,rawModule){
        if (typeof path == 'string') {
                path = [path]
        }
        // 注册模块
        this._modules.register(path,rawModule)

        // 安装模块
        installModule(this,this.state,path,rawModule.rawModule)

        resetStoreVm(this,this.state)
    }
}



const install = (_Vue)=>{
    Vue = _Vue;

    applyMixin(Vue)
}

export {
    Store,
    install
}