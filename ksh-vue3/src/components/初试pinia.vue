<template>
<div class="cont" >
    1111
    {{useCount1.name}}
    {{useCount1.double}}
    <button @click="useCount1.coudejj(2)">加以</button>
    {{name}}
    {{age}}
</div>
</template>
 
<script setup>
import { useCount } from "../stores/count";
import { storeToRefs } from "pinia";
//获取store实例
const useCount1=useCount()

//解构state
const {name,age} =storeToRefs(useCount1)

/*
  store的订阅
        --当store中的state发生变化的时候 ，做一些响应的操作
*/
useCount1.$subscribe(
    (mutations,state)=>{
        console.log(mutations);
    console.log('state改变了',state.name);
},
{
    //这个设置时不随组件的卸载而消失
    detached:true
}
)

</script>
 
<style lang = "less" scoped>
 
</style>