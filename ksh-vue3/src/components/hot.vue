<template>
  <div class="cont">
    <div class="chart" ref="hot_ref"></div>
    <span class="arr-left" @click="lefts" :style="comStyle">《</span>
    <span class="arr-right" @click="rights" :style="comStyle">》</span>
    <span class="arr-name" :style="comStyle">{{ names }}</span>
  </div>
</template>

<script setup>
import {getThemeValue} from '@/utils/theme_utils'
import {reactive,getCurrentInstance,onMounted,ref,onUnmounted,computed,watch} from 'vue'
import {useChalk} from "../stores/index"
let theme=useChalk().theme
let chartInstane= reactive(null)
           let allData=reactive(null)
           let titleSize=ref(0)
           let currIndex=ref(0)    //当前展示的数据
           let names=ref(null)
let {proxy} = getCurrentInstance()
let hot_ref=ref(null)
proxy.$socket.registerCallBack('hotData',getData)

onMounted(()=>{
    initChart()
        proxy.$socket.send({
            action:'getData',
            socketType:'hotData',
            chartName:'hotproduct',
            value:''
        })
        window.addEventListener("resize", winupdate)
        winupdate()
})

async function initChart() {
            chartInstane = proxy.$echarts.init(hot_ref.value, theme)
            const initOption = {
                series: [
                    {
                        type: 'pie',
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    }
                ],
                legend: {
                    top: '5%',
                    icon: 'circle'
                },
                tooltip:{
                    show:true,
                    formatter:(e)=>{
                        const children = e.data.children
                        let sum =0
                        children.forEach(item=>{
                           sum+= item.value
                        })
                        let strs=''
                        children.forEach(item=>{
                           strs+= `${item.name}:${parseInt(item.value/sum*100)}% <br />`
                        })
                        return strs
                    }
                }
            }
            chartInstane.setOption(initOption)
        }
        function getData(res) {
            allData = res
            updateChart()
        }
        function updateChart() {
            names.value = allData[currIndex.value].name
            const legenData = allData[currIndex.value].children.map(item => {
                return item.name
            })
            const seriesData = allData[currIndex.value].children.map(item => {
                return {
                    name: item.name,
                    value: item.value,
                    children:item.children
                }
            })
            const dataOption = {
                series: [
                    {
                        data: seriesData
                    }
                ],
                lengend: {
                    data: legenData
                }
            }
            chartInstane.setOption(dataOption)

        }
       function winupdate() {
           titleSize.value = hot_ref.value.offsetWidth / 100 * 3.6
            const wOption = {

                series: {
                  radius: titleSize.value*4.5,
                  center:['50%','50%']
                },
                legend:{
                    itemWidth:titleSize.value/2,
                    itemHeight:titleSize.value/2,
                    itemGap:titleSize.value/2
                }
            }
            chartInstane.setOption(wOption)
            chartInstane.resize()
        }
       function lefts() {
            currIndex.value--
            if (currIndex.value < 0) {
                currIndex.value =allData.length - 1
            }

            updateChart()
        }
       function rights() {
            currIndex.value
            if (currIndex.value > allData.length - 1) {
                currIndex.value = 0
            }

            updateChart()
        }
onUnmounted(() => {
    window.removeEventListener('resize', winupdate)
        proxy.$socket.unregisterCallBack('hotData')
        clearInterval(times)
})
const comStyle =computed(()=>{
    return {
                fontSize:titleSize.value +'px',
                color:getThemeValue(theme).titleColor
            }
})

watch(theme,()=>{
                //销毁当前图标
                chartInstane.dispose()
            initChart()    //重新获取新的图标信息
           winupdate()    //重新获取自适应
            updateChart()   //跟新图标的展示
});
</script>

<style lang="less" scoped></style>
