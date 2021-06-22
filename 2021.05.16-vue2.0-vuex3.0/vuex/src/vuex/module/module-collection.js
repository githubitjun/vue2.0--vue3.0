import { forEach } from "../unit";
import Module from "./module";

export default class ModuleCollection {
    constructor (options){
        // 注册模块 递归注册 根模块
        this.register([],options);
    }
    register (path,rootModule){
        let newModule = new Module(rootModule)
        rootModule.rawModule = newModule
        if(path.length == 0) {
            this.root = newModule
        }else {
            let parent = path.slice(0, -1).reduce((memo,current)=>{
           
                return memo.getChild(current)
            },this.root)
             parent.addChild(path[path.length-1],newModule)
           // parent._children[path[path.length-1]] = newModule
        }

        if (rootModule.modules) { // 如果 有 modules , 说明有子模块
            forEach(rootModule.modules,(module,moduleName)=>{
                this.register([...path,moduleName],module);
            })
        }
    }
    // 获取命名空间 
    getNamespace(path){
        let root = this.root;
        return path.reduce((namespace,key)=>{
            root = root.getChild(key)
            return namespace + (root.namespaced ? key + '/' :'')
        },'')
    }

}