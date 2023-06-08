import { defineStore } from "pinia";

export const useChalk = defineStore('chalk',{
    state:()=>({
        theme:'chalk',
    }),
    getters:{
        //和vuex一样
        // double:(state)=>state.age+2

    },
    //方法
    actions:{
        //这里可以通过this来指向state定义的数据
        // coudejj(i){
        //     this.age+=i
        // }
        changeTheme(){
            if(this.theme ==='chalk'){
                this.theme='vintage'
            }else{
                this.theme='chalk'
            }
          }
    }
})