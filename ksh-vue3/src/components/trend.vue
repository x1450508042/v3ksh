<template>
  <div class="cont">
    <div class="title" :style="comStyle">
      <span @click="isShow = !isShow" :style="comStyle">{{ titmap }} ⬇</span>
      <div class="select" v-show="isShow" :style="marginStyle">
        <template v-for="item in tp" :key="item.key">
          <div
            class="select-item"
            @click="hand(item.key)"
            v-if="item.key != showType"
          >
            {{ item.text }}
          </div>
        </template>
      </div>
    </div>
    <div class="chart" ref="trendRef"></div>
  </div>
</template>

<script setup>
import { useChalk } from "../stores/index";
import { getThemeValue } from "@/utils/theme_utils";
import {
  reactive,
  ref,
  onMounted,
  computed,
  getCurrentInstance,
  onUnmounted,
  watch,
} from "vue";

let chartInstane = reactive(null);
let allData = reactive({});
let tp = reactive(null);
let isShow = ref(false);
let showType = ref("map");
let titleSize = ref(0);
let trendRef = ref(null);
let titmap = ref(null);
const { proxy } = getCurrentInstance();
const theme = useChalk().theme;

proxy.$socket.registerCallBack("trendData", getData);
watch(showType.value, (news, old) => {
  titmap.value = news;
});
watch(theme, () => {
  //销毁当前图标
  chartInstane.dispose();
  initChart(); //重新获取新的图标信息
  winupdate(); //重新获取自适应
  updateChart(); //跟新图标的展示
});
onMounted(() => {
  //在组件创建的时候开始回调
  initChart();
  // getData()
  // // 发送数据给服务器  ，告诉服务器我需要数据
  proxy.$socket.send({
    action: "getData",
    socketType: "trendData",
    chartName: "trend",
    value: "",
  });
  window.addEventListener("resize", winupdate);
  winupdate();

  // console.log(allData);
  // console.log(111);
});
onUnmounted(() => {
  window.removeEventListener("resize", winupdate);
  proxy.$socket.unregisterCallBack("trendData");
});

// const titmap=computed(()=>{
//             if(allData != {}){
//                 return ''
//             }else{
//                 return allData[showType.value].title
//             }
//         })

const comStyle = computed(() => {
  return {
    fontSize: titleSize.value + "px",
    color: getThemeValue(theme).titleColor,
  };
});
const marginStyle = computed(() => {
  return {
    marginLeft: titleSize.value + "px",
  };
});
function initChart() {
  chartInstane = proxy.$echarts.init(trendRef.value, theme);
  const initOption = {
    xAxis: {
      type: "category",
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
    },
    grid: {
      left: "3%",
      top: "35%",
      rigth: "4%",
      bottom: "1%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      left: 20,
      top: "15%",
      icon: "circle",
    },
  };
  chartInstane.setOption(initOption);
}
function getData(res) {
  // let res = await $http.get('trend')
  allData = res;
  tp = res.type;
  titmap.value = allData[showType.value].title;
  // console.log(allData[showType.value].title);
  updateChart();
}
function updateChart() {
  //半透明的颜色值
  const colorArr1 = [
    "rgba(11,168,44,0.5)",
    "rgba(44,110,255,0.5)",
    "rgba(22,242,217,0.5)",
    "rgba(254,33,30,0.5)",
    "rgba(250,105,0,0.5)",
  ];
  //全透明
  const colorArr2 = [
    "rgba(11,168,44,0)",
    "rgba(44,110,255,0)",
    "rgba(22,242,217,0)",
    "rgba(254,33,30,0)",
    "rgba(250,105,0,0)",
  ];

  //类目轴的数据
  const timeArr = allData.common.month;
  //y轴的数据 series下的
  const valueArr = allData[showType.value].data;
  const seriesArr = valueArr.map((item, index) => {
    return {
      name: item.name,
      type: "line",
      data: item.data,
      stack: showType.value,
      areaStyle: {
        color: new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colorArr1[index],
          },
          {
            offset: 1,
            color: colorArr2[index],
          },
        ]),
      },
    };
  });
  // 图例的数据
  const legendArr = valueArr.map((item) => {
    return item.name;
  });
  const dataOption = {
    xAxis: {
      data: timeArr,
    },
    legend: {
      data: legendArr,
    },
    series: seriesArr,
  };
  chartInstane.setOption(dataOption);
}
function winupdate() {
  titleSize.value = (trendRef.value.offsetWidth / 100) * 3.6;
  const wOption = {
    legend: {
      itemWidth: titleSize.value,
      itemHeigth: titleSize.value,
      itemGap: titleSize.value,
      textStyle: {
        fontSize: titleSize.value / 2,
      },
    },
  };
  chartInstane.setOption(wOption);
  chartInstane.resize();
}
function hand(key) {
  showType.value = key;
  updateChart();
  isShow.value = false;
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: #ffff;
  cursor: pointer;
}

.select {
  background-color: #222733;
}
</style>
