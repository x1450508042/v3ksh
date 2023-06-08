<template>
    <div class="cont">
        <div class="chart" ref="rank_ref"></div>
    </div>
</template>
 
<script setup>
import { getCurrentInstance, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useChalk } from "../stores/index"
let chartInstane = reactive(null)
let allData = reactive(null)
let titleSize = ref(0)
let startValue = ref(0)   //区域缩放的起点
let endValue = ref(9) //区域缩放的终点
let times = ref(null)
const theme = useChalk().theme
let { proxy } = getCurrentInstance()
proxy.$socket.registerCallBack('rankData', getData)
let rank_ref = ref(null)
onMounted(() => {
    initChart()
    proxy.$socket.send({
        action: 'getData',
        socketType: 'rankData',
        chartName: 'rank',
        value: ''
    })
    window.addEventListener("resize", winupdate)
    winupdate()
})

async function initChart() {
    chartInstane = proxy.$echarts.init(rank_ref.value, theme)
    //获取中国地图的适量数据
    const initOption = {
        title: {
            text: '销售排行',
            left: 20,
            top: 20
        },
        grid: {
            top: '40%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {
            show: true
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                type: "bar"
            }
        ]
    }
    chartInstane.setOption(initOption)
}
function getData(res) {
    //获取地图的散点数据
    allData = res
    allData.sort((a, b) => {
        return a.value - b.value
    })
    updateChart()
    startInterval()
}
function updateChart() {
    //所有省份的数组
    const prvo = allData.map(item => {
        return item.name
    })
    //所有省份对应的销售金额
    const valueArr = allData.map(item => {
        return item.value
    })
    const dataOption = {
        xAxis: {
            data: prvo
        },
        //展示多少条数据
        dataZoom: {
            show: false,
            startValue: startValue.value,
            endValue: endValue.value
        },
        series: [{
            data: valueArr,
            itemStyle: {
                color: (e) => {
                    if (e.value > 300) {
                        return new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#2e72bf'
                            },
                            {
                                offset: 1,
                                color: '#23e5e5'
                            }
                        ])
                    } else if (e.value > 200) {
                        return new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#5052ee'
                            },
                            {
                                offset: 1,
                                color: '#ab6ee5'
                            }
                        ])
                    } else {
                        return new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#0ba82c'
                            },
                            {
                                offset: 1,
                                color: '#4ff778'
                            }
                        ])
                    }

                }
            }
        }]
    }
    chartInstane.setOption(dataOption)
    chartInstane.on('mouseover', () => {
        clearInterval(times.value)
    })
    chartInstane.on('mouseout', () => {
        startInterval()
    })
}
function winupdate() {
    titleSize.value = rank_ref.value.offsetWidth / 100 * 3.6
    const wOption = {
        title: {
            textStyle: {
                fontSize: titleSize.value
            }
        },
        series: [
            {
                barWidth: titleSize.value,
                itemStyle: {
                    barBorderRadius: [titleSize.value / 2, titleSize.value / 2, 0, 0],
                }
            }
        ]
    }
    chartInstane.setOption(wOption)
    chartInstane.resize()
}
function startInterval() {
    if (times.value) clearInterval(times.value)
    times.value = setInterval(() => {
        if (endValue.value > allData.length - 1) {
            startValue.value = 0
            endValue.value = 9
        }
        startValue.value++
        endValue.value++
        updateChart()
    }, 2000)
}
onUnmounted(() => {
    window.removeEventListener('resize', winupdate)
    proxy.$socket.unregisterCallBack('rankData')
    clearInterval(times.value)
})
watch(theme, () => {
    //销毁当前图标
    this.chartInstane.dispose()
    this.initChart()    //重新获取新的图标信息
    this.winupdate()    //重新获取自适应
    this.updateChart()   //跟新图标的展示
})

</script>
 
<style lang = "less" scoped></style>