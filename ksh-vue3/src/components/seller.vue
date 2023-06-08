<template>
    <div class="cont">
        <div class="chart" ref="seller_ref"></div>
    </div>
</template>
 
<script setup>
import { getCurrentInstance, reactive, ref, onMounted, onUnmounted, watch } from 'vue'
import { useChalk } from '../stores/index'
let chartInstance = reactive(null)
let allData = reactive(null)  //服务器返回的1数据
let currentPage = ref(1) //当前显示多少页
let totalPage = ref(0)//一共多少页
let timeId = ref(null)
const theme = useChalk().theme
const { proxy } = getCurrentInstance()
let seller_ref = ref(null)
proxy.$socket.registerCallBack('sellerData', getData)

onMounted(() => {
    initChart()
    proxy.$socket.send({
        action: 'getData',
        socketType: 'sellerData',
        chartName: 'seller',
        value: ''
    })
    window.addEventListener("resize", winupdate)
    winupdate()
})
onUnmounted(() => {
    clearInterval(timeId.value)
    window.removeEventListener('resize', winupdate)
    proxy.$socket.unregisterCallBack('sellerData')
})

watch(theme, () => {
    //销毁当前图标
    this.chartInstance.dispose()
    this.initChart()    //重新获取新的图标信息
    this.winupdate()    //重新获取自适应
    this.updateChar()   //跟新图标的展示
})
//初始化 chartInstance 对象
function initChart() {
    chartInstance = proxy.$echarts.init(seller_ref.value, theme)
    //对图表初始化的控制
    const initOption = {
        title: {
            text: '销售统计',
            textStyle: {
                fontSize: 66
            },
            left: 20,
            top: 20,
        },
        //配置坐标轴的位置
        grid: {
            top: '20%',
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true, //距离是包含坐标轴上的文字的
        },
        xAxis: {
            type: 'value',
        },
        yAxis: {
            type: 'category',
            // data: sellerNames
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                z: 0,
                lineStyle: {
                    width: 66,
                    color: '#2d3443'
                }
            }
        },
        series: [
            {
                type: 'bar',
                // data: sellerValue,
                barWidth: 66,
                label: {
                    show: true,
                    position: 'right',
                    textStyle: {
                        color: 'white'
                    }
                },
                itemStyle: {
                    barBorderRadius: [0, 33, 33, 0],
                    //颜色渐变方向
                    //不同百分比之下的颜色值
                    color: new proxy.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        //百分之零状态下的颜色值
                        {
                            offset: 0,
                            color: '#5052EE'
                        },
                        //百分之百状态下的颜色值
                        {
                            offset: 1,
                            color: '#AB6EE5'
                        }
                    ])
                }
            }
        ]
    }
    chartInstance.setOption(initOption)
    //鼠标移入事件
    chartInstance.on('mouseover', () => {
        clearInterval(timeId.value)
    })
    //鼠标移出事件
    chartInstance.on('mouseout', () => {
        startInterval()
    })
}
//获取服务器数据
function getData(res) {
    allData = res
    allData.sort((a, b) => {
        return a.value - b.value
    })
    totalPage.value = allData.length % 5 == 0 ? allData.length / 5 : allData.length / 5 + 1
    updateChar()
    startInterval()
}
//更新图表
function updateChar() {
    const start = (currentPage.value - 1) * 5
    const end = currentPage.value * 5
    const showData = allData.slice(start, end)
    const sellerNames = showData.map((item) => {
        return item.name
    })
    const sellerValue = showData.map((item) => {
        return item.value
    })
    const dataOption = {

        yAxis: {
            data: sellerNames
        },
        series: [
            {
                data: sellerValue,
            }
        ]
    }
    chartInstance.setOption(dataOption)
}
function startInterval() {
    if (timeId.value) {
        clearInterval(timeId.value)
    }
    timeId = setInterval(() => {
        currentPage.value++
        if (currentPage.value > totalPage.value) {
            currentPage.value = 1
        }
        updateChar()
    }, 3000);
}
//当浏览器的大小发生改变的时候会调用的方法，来完成屏幕的适配
function winupdate() {
    const w = seller_ref.value.offsetWidth / 100 * 3.6
    const winupdateOption = {
        title: {
            textStyle: {
                fontSize: w
            }
        },
        tooltip: {
            axisPointer: {
                lineStyle: {
                    width: w,
                }
            }
        },
        series: [
            {
                type: 'bar',
                barWidth: w,
                itemStyle: {
                    barBorderRadius: [0, w / 2, w / 2, 0],
                }
            }
        ]
    }
    chartInstance.setOption(winupdateOption)
    chartInstance.resize()
}


</script>
 
<style lang = "less" scoped></style>