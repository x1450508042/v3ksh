<template>
  <div class="cont" @dblclick="REmap">
    <div class="chart" ref="map_ref"></div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref,onMounted,onUnmounted,watch } from 'vue';
import axios from "axios"
import {useChalk} from "../stores/index"
import { getProvinceMapInfo } from "@/utils/map_utils";

let chartInstane = reactive(null)
let allData = reactive(null)
let titleSize = ref(0)
//地图缓存1
let mapData = reactive({})
let theme=useChalk().theme
let map_ref=ref(null)
let {proxy} = getCurrentInstance()
proxy.$socket.registerCallBack('mapData', getData)
onMounted(()=>{
    initChart()
        proxy.$socket.send({
            action:'getData',
            socketType:'mapData',
            chartName:'map',
            value:''
        })
        window.addEventListener("resize", winupdate)
        winupdate()
})

async function initChart() {
            chartInstane = proxy.$echarts.init(map_ref.value, theme)
            let res = await axios.get('http://localhost:8999/static/map/china.json')
            proxy.$echarts.registerMap('china', res.data)
            //获取中国地图的适量数据
            const initOption = {
                title: {
                    text: '🔽 地图分布',
                    left: 20,
                    top: 20
                },
                geo: {
                    type: 'map',
                    map: 'china',
                    top: '5%',
                    bottom: '5%',
                    itemStyle: {
                        areaColor: '#2E72BF',
                        borderColor: '#333'
                    }
                },
                legend: {
                    left: '5%',
                    bottom: '5%',
                    orient: 'vertical'
                }
            }
            chartInstane.setOption(initOption)
            chartInstane.on('click', async (e) => {
                const prove = getProvinceMapInfo(e.name)
                if (!mapData[prove.key]) {
                    let res = await axios.get('http://localhost:8999' + prove.path)
                    mapData[prove.key] = res.data
                    proxy.$echarts.registerMap(prove.key, res.data)
                }

                const changeO = {
                    geo: {
                        map: prove.key
                    }
                }
                chartInstane.setOption(changeO)
            })
        }
        function getData(res) {
            //获取地图的散点数据
           allData = res
            updateChart()
        }
       function updateChart() {
            const legendARR = allData.map(item => {
                return item.name
            })
            const ARR = allData.map(item => {
                //返回的对象代表的是一个类别的散点数据
                //如果想在地图中显示散点的数据，所以我们需要给散点图增加一个配置 coordinateSystem:geo
                return {
                    type: "effectScatter",
                    name: item.name,
                    data: item.children,
                    coordinateSystem: 'geo',
                    rippleEffect: {
                        scale: 5,
                        brushType: 'stroke'
                    }
                }
            })
            const dataOption = {
                series: ARR,
                legend: {
                    data: legendARR
                }
            }
            chartInstane.setOption(dataOption)
        }
       function winupdate() {
           titleSize.value = map_ref.value.offsetWidth / 100 * 3.6
            const wOption = {
                title: {
                    textStyle: {
                        fontSize: titleSize.value
                    }
                },
                legend: {
                    itemWidth: titleSize.value / 2,
                    itemHeigth: titleSize.value / 2,
                    itemGap: titleSize.value / 2,
                    textStyle: {
                        fontSize: titleSize.value / 2
                    }
                }
            }
            chartInstane.setOption(wOption)
            chartInstane.resize()
        }
       function REmap() {
            const revertOption = {
                geo: {
                    map: 'china'
                }
            }
            chartInstane.setOption(revertOption)
        }
onUnmounted(() => {
    window.removeEventListener('resize', winupdate)
        proxy.$store.unregisterCallBack('mapData')
})
watch(theme,()=>{
    chartInstane.dispose()
            initChart()    //重新获取新的图标信息
            winupdate()    //重新获取自适应
            updateChart()   //跟新图标的展示
})
</script>

<style lang="less" scoped></style>
