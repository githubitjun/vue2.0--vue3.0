// ast语法树 是用对象来描述原生语法的   虚拟dom 用对象来描述dom节点的
// ?: 匹配不捕获
// argumens[0] = 匹配到的标签  arguments[1] 匹配到的标签名字

import {parseHTML} from './parser-html';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genProps(attrs){ // 处理属性 拼接成属性的字符串
    let str = '';
    for(let i = 0; i < attrs.length;i++){
        let attr = attrs[i];
        if(attr.name === 'style'){
            // style="color: red;fontSize:14px" => {style:{color:'red'},id:name,}
            let obj = {};
            attr.value.split(';').forEach(item=>{
                let [key,value] = item.split(':');
                obj[key] = value
            });
            attr.value = obj;
        }
        str+= `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`
}

function genChildren(el){
    let children = el.children;
    if(children && children.length > 0){
        return `${children.map(c=>gen(c)).join(',')}`
    }else{
        return false;
    }
}

function gen(node){
    if(node.type == 1){
        // 元素标签
        return generate(node);
    }else{
        let text = node.text; //   <div>a {{  name  }} b{{age}} c</div>
        let tokens = [];
        let match,index;
        // 每次的偏移量 buffer.split()
        let lastIndex = defaultTagRE.lastIndex = 0; // 只要是全局匹配 就需要将lastIndex每次匹配的时候调到0处
        while(match = defaultTagRE.exec(text)){
            index = match.index;
            if(index > lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex,index)));
            }
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length;
        }
        if(lastIndex < text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return `_v(${tokens.join('+')})`;
    }
}

function generate(el){ // [{name:'id',value:'app'},{}]  {id:app,a:1,b:2}
    let children = genChildren(el);
    let code = `_c("${el.tag}",${
       el.attrs.length?genProps(el.attrs):'undefined'
    }${
        children? `,${children}` :''
    })
    `
    return code;
}


export function compileToFunction (template){
     // 1) 解析html字符串 将html字符串 => ast语法树 
     let root = parseHTML(template);
     // 需要将ast语法树生成最终的render函数  就是字符串拼接 （模板引擎）
     let code = generate(root);

      // 核心思路就是将模板转化成 下面这段字符串
    //  <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树 再次转化成js的语法
    //  _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello'))

    // 所有的模板引擎实现 都需要new Function + with
    let renderFn = new Function(`with(this){ return ${code}}`);
    
    // vue的render 他返回的是虚拟dom
    return renderFn;
}