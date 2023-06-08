<template>
    <div class="screen-container" :style="containerStyle">
      <header class="screen-header">
        <div>
          <img :src="headerSrc" alt="">
        </div>
        <span class="title">平台实时监控系统</span>
        <div class="title-right">
          <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme">
          <span class="datetime">{{ mytime }}</span>
        </div>
      </header>
      <div class="screen-body">
        <section class="screen-left">
          <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
            <!-- 销量趋势图表 -->
            <Trend ref="trend"></Trend>
            <div class="resize">
              <span :title="tit" @click="changeSize('trend')">{{ '<>' }}</span>
            </div>
          </div>
          <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
            <!-- 商家销售金额图表 -->
            <Seller ref="seller"></Seller>
            <div class="resize">
              <span :title="tit" @click="changeSize('seller')">{{ '<>' }}</span>
            </div>
          </div>
        </section>
        <section class="screen-middle">
          <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
            <!-- 商家分布图表 -->
            <Map ref="map"></Map>
            <div class="resize">
              <span :title="tit" @click="changeSize('map')">{{ '<>' }}</span>
            </div>
          </div>
          <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
            <!-- 地区销量排行图表 -->
            <Rank ref="rank"></Rank>
            <div class="resize">
              <span :title="tit" @click="changeSize('rank')">{{ '<>' }}</span>
            </div>
          </div>
        </section>
        <section class="screen-right">
          <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
            <!-- 热销商品占比图表 -->
            <Hot ref="hot"></Hot>
            <div class="resize">
              <span :title="tit" @click="changeSize('hot')">{{ '<>' }}</span>
  
            </div>
          </div>
          <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
            <!-- 库存销量分析图表 -->
            <Stock ref="stock"></Stock>
            <div class="resize">
              <span :title="tit" @click="changeSize('stock')">{{ '<>' }}</span>
  
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
 
<script setup>
import { getCurrentInstance ,onMounted,reactive,ref,computed ,nextTick} from "vue";
import Hot from '@/components/hot.vue'
import Map from '@/components/map.vue'
import Rank from '@/components/rank.vue'
import Seller from '@/components/seller.vue'
import Stock from '@/components/store.vue'
import Trend from '@/components/trend.vue'
import { getThemeValue } from '@/utils/theme_utils'
import {useChalk} from "../stores/index"
import { storeToRefs } from "pinia";
let useChalk1=useChalk()
let {theme}= storeToRefs(useChalk1)

      // 定义每一个图表的全屏状态
     let fullScreenStatus=reactive({
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }) 
      let tit=ref('放大')
     let mytime=ref(null)
     let tn=ref(null)
      // let trend=ref(null)
      // let seller= ref(null)
      // let map=ref(null)
      // let rank=ref(null)
      // let hot=ref(null)
      // let stock=ref(null)
let {proxy} = getCurrentInstance()
proxy.$socket.registerCallBack('fullScreen', getData)
proxy.$socket.registerCallBack('themeChange', themeChange)
times()
onMounted(()=>{
  console.log(proxy.$refs.trend);
    setInter()
})
function changeSize(chartName) {
      // 1.改变fullScreenStatus的数据
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 2.需要调用每一个图表组件的screenAdapter的方法
      // this.$refs[chartName].screenAdapter()
      // this.$nextTick(() => {
      //   this.$refs[chartName].winupdate()
      // })

      // 将数据发送给服务端
      const V = !fullScreenStatus[chartName]
      if(fullScreenStatus[chartName]){
        tit.value='放大'
      }else{
        tit.value='缩小'
      }
      proxy.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName:chartName,
        value: V
      })
    }
   function getData(data) {
      // 取出是哪一个图表需要进行切换
      const chartName = data.chartName
      const targetValue = data.value
      fullScreenStatus[chartName] = targetValue
      console.log(chartName);
      nextTick(() => {
       proxy.$refs[chartName].winupdate()
      })
    }
    //点击按钮修改主题
   function handleChangeTheme(){
      //使用socket联动切换主题
      // this.$store.commit('changeTheme')
      proxy.$socket.send({
        action:'themeChange',
        socketType:'themeChange',
        chartName:'',
        value:''
      })
    }
   function themeChange(){
      // theme= 'changeTheme'
      useChalk1.changeTheme()
    }
   function times(){
        let now = new Date()
        let year =now.getFullYear() //年
        let month =now.getMonth()+1 //月
        let data =now.getDate() //日
        let hour =now.getHours()//时
        let minute =now.getMinutes()//分
        let secound =now.getSeconds()//秒
        mytime.value= year+'年'+month+'月'+data+'日 '+hour+':'+minute+':'+secound
    }
    //计时器倒计时
   function setInter(){
      if(tn.value) clearInterval(tn.value)
      tn.value=setInterval(()=>{
        times()
      },1000)
    }

    let headerSrc = computed(()=>{
        return '/static/img/'+getThemeValue(theme.value).headerBorderSrc
    })
    let themeSrc =computed(()=>{
        return '/static/img/'+getThemeValue(theme.value).themeSrc
    })
    let containerStyle= computed(()=>{
        return {
        backgroundColor:getThemeValue(theme.value).backgroundColor,
        color:getThemeValue(theme.value).titleColor,
      }
    });
</script>
 
<style lang = "less" scoped>
 // 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;

  >div {
    img {
      width: 100%;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }

  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;

  .screen-left {
    height: 100%;
    width: 27.6%;

    #left-top {
      height: 53%;
      position: relative;
    }

    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }

  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }

    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }

  .screen-right {
    height: 100%;
    width: 27.6%;

    #right-top {
      height: 46%;
      position: relative;
    }

    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>