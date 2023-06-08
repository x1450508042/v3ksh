<template>
    <div class="cont">
        <div class="chart" ref="store_ref"></div>
    </div>
</template>
 
<script setup>
import { reactive, ref, onMounted, onUnmounted, watch ,getCurrentInstance} from "vue";
import { useChalk } from "../stores/index"
let chartInstane = reactive(null)
let allData = reactive(null)
let titleSize = ref(0)
let currIndex = ref(0)
let times = ref(null)
const { proxy } = getCurrentInstance()
const theme = useChalk().theme
let store_ref = ref(null)
proxy.$socket.registerCallBack('storeData', getData)

onMounted(() => {
    initChart()
    proxy.$socket.send({
        action: 'getData',
        socketType: 'storeData',
        chartName: 'stock',
        value: ''
    })
    window.addEventListener("resize", winupdate)
    winupdate()
})

onUnmounted(() => {
    window.removeEventListener('resize', winupdate)
    proxy.$socket.unregisterCallBack('storeData')
    clearInterval(times.value)
})

watch(theme, (news, old) => {
    //销毁当前图标
    this.chartInstane.dispose()
    this.initChart()    //重新获取新的图标信息
    this.winupdate()    //重新获取自适应
    this.updateChart()   //跟新图标的展示
})


function initChart() {
    chartInstane = proxy.$echarts.init(store_ref.value, theme)
    const initOption = {

    }
    chartInstane.setOption(initOption)
    chartInstane.on('mouseover', () => {
        clearInterval(times.value)
    })
    chartInstane.on('mouseout', () => {
        startInterval()
    })
}
function getData(res) {
    allData = res
    updateChart()
    startInterval()
}
function updateChart() {
    const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%'],
    ]
    const colorARR = [
        ['#4ff778', '#0ba82c'],
        ['#e5dd45', '#e8811c'],
        ['#e8821c', '#e55445'],
        ['#5052ee', '#ab6ee5'],
        ['#23e5e5', '#2e72bf'],
    ]
    const start = currIndex.value * 5
    const end = (currIndex.value + 1) * 5
    const showData = allData.slice(start, end)
    const seriesArr = showData.map((item, index) => {
        return {
            type: 'pie',
            center: centerArr[index],
            hoverAnimation: false, //关闭鼠标移入时的动画效果
            labelLine: {
                show: false
            },
            label: {
                position: 'center',
                color: colorARR[index][0]
            },
            data: [
                {
                    name: item.name + '\n' + item.sales,
                    value: item.sales,
                    itemStyle: {
                        color: new proxy.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                color: colorARR[index][0]
                            },
                            {
                                offset: 1,
                                color: colorARR[index][1]
                            }
                        ])
                    }
                },
                {
                    value: item.stock,
                    itemStyle: {
                        color: '#333843'
                    }
                }
            ]
        }
    })
    const dataOption = {
        series: seriesArr
    }
    chartInstane.setOption(dataOption)

}
function winupdate() {
    titleSize.value = store_ref.value.offsetWidth / 100 * 3.6
    const innerRadius = titleSize.value * 2.8
    const outterRadius = innerRadius * 1.125
    const wOption = {
        series: [
            {
                type: 'pie',
                radius: [outterRadius, innerRadius],
                label: {
                    fontSize: titleSize.value / 2
                }
            },
            {
                type: 'pie',
                radius: [outterRadius, innerRadius],
                label: {
                    fontSize: titleSize.value / 2
                }
            }, {
                type: 'pie',
                radius: [outterRadius, innerRadius],
                label: {
                    fontSize: titleSize.value / 2
                }
            }, {
                type: 'pie',
                radius: [outterRadius, innerRadius],
                label: {
                    fontSize: titleSize.value / 2
                }
            }, {
                type: 'pie',
                radius: [outterRadius, innerRadius],
                label: {
                    fontSize: titleSize.value / 2
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
        if (currIndex.value > 1) {
            currIndex.value = 0
        } else {
            currIndex.value++
        }
        updateChart()
    }, 5000)
}

</script>
 
<style lang = "less" scoped></style>