<template>
  <div id="app">
    
     <div> 年龄{{ $store.state.age }}</div>  <br>
     <div> 年龄{{ age }}</div>  <br>
     <div> 年龄getter {{ $store.getters.getAge }} </div> <br>
     <div> 年龄getter {{ getAge }} </div> <br>
      <button @click="$store.commit('changeAge',10)">根模块 mutations 触发</button><br>
      <button @click="changeAge(10)">根模块 mutations 触发</button><br>
      <button @click="$store.state.age += 10"> 不合理的修改 </button> <br>
       <br>  <br>
   
   


   <div> 年龄{{ $store.state.a.ageA }}</div>  <br>
   <button @click="$store.commit('a/changeAge',10)">mutations 触发</button> <br>  <br>
   <button @click="$store.dispatch('changeAge',10)">actions 触发</button>


    
   

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { mapState,mapGetters,mapMutations,mapActions } from './vuex/index'
export default {
  name: 'App',
  components: {
    HelloWorld
  },
  computed:{
    ...mapState(['age']),
    ...mapGetters(['getAge'])
  },
  methods: {
    ...mapMutations(['changeAge'])
  },
  mounted() {
    console.log(this)
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
