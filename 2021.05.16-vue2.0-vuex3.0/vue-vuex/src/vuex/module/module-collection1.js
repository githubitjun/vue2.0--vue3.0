import { forEach } from "../unit";

export default class ModuleCollection {
    constructor (options){
        // 注册模块 递归注册 根模块
        this.register([],options);
    }
    register (path,rootModule){
        let newModule = {
            _raw:rootModule,
            _children:{},
            state:rootModule.state
        }
        if(path.length== 0) {
            this.root = newModule
        }else {
            let parent = path.slice(0,-1).reduce((memo,current)=>{
                return memo._children[current]
            },this.root)
            parent._children[path[path.length-1]] = newModule
        }

        if (rootModule.modules) { // 如果 有 modules , 说明有子模块
            forEach(rootModule.modules,(module,moduleName)=>{
                this.register([...path,moduleName],module);
            })
        }
    }
}