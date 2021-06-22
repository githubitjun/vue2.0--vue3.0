import Vue from 'vue'
import Vuex from '../vuex'

// 持久化插件
function persists(store){
  let local = localStorage.getItem('VUEX:STATE');
  if (local) {
      store.replaceState(JSON.parse(local))
  }
  store.subscribe((mutation,state)=>{
    // console.log('11',state.age);
    localStorage.setItem('VUEX:STATE',JSON.stringify(state))
  })
}



Vue.use(Vuex)

let store = new Vuex.Store({ // 内保部会创建一个vue 实例,通讯用
  strict:true,
  plugins:[
    persists
  ],

  state: { // 组件的状态 new Vue(data)
    age: 10,
  },
  getters: { // 获取计算属性 new Vue(computed) 依赖 , 当依赖的值变化会重新执行
    getAge(state) {
      // 如果age 属性不发生变化 就不会重新执行
      return state.age + 18;
    }
  },
  mutations: { // vuex中的方法 唯一可以改变状态的方法
    changeAge(state, payload) { // 同步方法
      state.age += payload
    }
  },
  actions: {
    changeAge({ commit }, payload) {
      setTimeout(() => {
        commit('changeAge', payload)
      }, 1000)
    }
  },
  modules: {
    a: {
      namespaced:true,
      state: {
        ageA: 20
      },
      getters: {
        getAgeA(state) {
          return state.ageA += 10
        }
      },
      mutations: { // vuex中的方法 唯一可以改变状态的方法
        changeAge(state, payload) { // 同步方法
          state.ageA += payload
        }
      },
      modules: {
        b: {
          namespaced:true,
          state: {
            ageB: 30
          },
          getters: {
            getAgeB(state) {
              return state.ageB += 10
            }
          },
        }
      }
    },
    c: {
      // namespaced:true,
      state: {
        ageC: 40
      },
      getters: {
        getAgeC(state) {
          return state.ageC += 10
        }
      },
    }
  }
})


store.registerModule(['c','e'],{
  // namespaced:true,
  state:{
    ageE:60
  }
})

console.log(store);

export default store