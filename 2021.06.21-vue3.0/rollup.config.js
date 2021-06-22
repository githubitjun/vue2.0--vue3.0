import ts from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import serve from 'rollup-plugin-serve'

import path from 'path'

export default {
    input:'src/index.ts', // 入口
    output:{ // 出口
        name:'VueReactivity', // 
        format:'umd',// 打包后的格式
        file:path.resolve('dist/vue.js'),// 输出的文件路径
        sourcemap:true,//生成的映射文件
    },
    // 插件
    plugins:[
        nodeResolve({
            extensions:['.js','.ts']
        }),
        // 解析第三方模块
        ts({
            tsconfig:path.resolve(__dirname,'tsconfig.json')
        }),
        // 解析环境变量
        replace({
            'process.env.NODE_ENV':JSON.stringify('development'),
            preventAssignment:true,
        }),
        serve({
            open:true,
            openPage:'/public/index.html',
            port:3000,
        })
    ]
}