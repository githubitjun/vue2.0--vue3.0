
const applyMixin = (Vue)=>{
    Vue.mixin({
        beforeCreate:vueInit
    }); // 全局混入 beforeCreate 的执行是先父后子
}

function vueInit(){
    const options = this.$options;
    if (options.store) {
        // 根实例
        this.$store = options.store;
    }else if(options.parent && options.parent.$store){
        // 子组件
        this.$store = options.parent.$store;
    }
}

export default applyMixin
    