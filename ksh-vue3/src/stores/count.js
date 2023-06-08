//引入 函数 defineStore()
import { defineStore } from "pinia";
import { ref,computed } from "vue";

//通过函数来创建store
//defineStore("store的id",配置对象)
//配置对象：state,是一个函数，将需要由pinia维护的数据以对象的形式返回1
//选项式
export const useCount = defineStore('count',{
    state:()=>({
        name:'猪八戒',
        age:18,
        gender:'男'
    }),
    getters:{
        //和vuex一样
        double:(state)=>state.age+2
    },
    //方法
    actions:{
        //这里可以通过this来指向state定义的数据
        coudejj(i){
            this.age+=i
        }
    }
})

//组合式
// export const useCount =defineStore('count',()=>{
//     const age =ref(50)
//     const name =ref('孙悟空')
//     const double =computed(()=>age.value+2)
//     function coudejj(){
//         age.value++
//     }
//     return {age,name,double,coudejj}
// })