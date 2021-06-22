##
    cnpm install typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve 
    rollup-plugin-typescript2: 将 typescript 和 rollup 之间建立联系
    @rollup/plugin-node-resolve: 解析第三方模块 
    @rollup/plugin-replace:  解析变量, prossenv 解析, 替换插件
    rollup-plugin-serve: 启动一个服务

    npx tsc --init :  生成 ts 配置文件

    ``` 
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1",
            "dev":"rollup -c -w"  // -w 监控用户改变 -c 指定配置文件
        },

    ```

    接下来安装 cnpm install @vue/reactivity 这是一个vue3.0的响应式包