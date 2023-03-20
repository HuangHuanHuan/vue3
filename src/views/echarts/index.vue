<template>
  <div class="echarts">
    <!-- echarts
    <div
      class="example"
      ref="example"
      style="width: '600px'; height: '400px'"
    ></div> -->
    1231
    <a-input v-model:value="a"></a-input>
  </div>
  <!-- <a-input v-model:value="a"></a-input> -->
</template>

<script lang="ts">
export default {
  name: "echarts",
};
</script>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref } from "vue";

const example = ref<HTMLElement | null>(null);
const a = ref("");
onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  // var myChart = echarts.init(example.value as HTMLElement);
  // console.log("myChart", myChart);
  // // 绘制图表
  // myChart.setOption({
  //   title: {
  //     text: "ECharts 入门示例",
  //   },
  //   tooltip: {},
  //   xAxis: {
  //     data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
  //   },
  //   yAxis: {},
  //   series: [
  //     {
  //       name: "销量",
  //       type: "line",
  //       data: [5, 20, 36, 10, 10, 20],
  //     },
  //   ],
  // });
});
</script>

<style scoped>
.example {
  width: 600px;
  height: 400px;
}
</style>
