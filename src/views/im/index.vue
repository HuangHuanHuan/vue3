<template>
  <div class="im">
    <input v-model="content" type="text" />
    <button @click="send">发送</button>
    <div class="content" ref="scrollRef">
      <div class="wrapper">
        <div class="load-more" :class="{ show: loadMore }">加载新数据</div>
        <div v-for="(item, index) in contentList.data" :key="index">
          {{ item.value }}
          <span v-if="item.type == 'loading'">发送中</span>
          <span v-else-if="item.type === 'success'">发送成功</span>
          <span v-else-if="item.type === 'fail'">发送失败</span>
        </div>
      </div>
      <div class="loading" v-if="loading">加载中</div>
    </div>
  </div>
  <a-input v-model:value="a"></a-input>
</template>

<script lang="ts">
export default {
  name: "im",
};
</script>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";

const a = ref("");
const content = ref("");
const contentList = reactive({
  data: [] as Array<Record<string, any>>,
});
const loading = ref(false);
const loadMore = ref(false);
let first = true;
const scrollRef = ref();
const conut = 0;

const fetchData = async () => {
  if (!first) {
    //第一次进入页面的时候不需要展示架在更多
    loadMore.value = true;
  }
  if (first) {
    // 第一次进入页面的时候需要展示loading
    loading.value = true;
    first = false;
  }
  count++;
  //   当上拉到顶部的时候会显示加载更多，此时需要等视图渲染完再获取scrollHeight，不然最后定位滚动条的位置会有问题
  await nextTick();
  const start = scrollRef.value.scrollHeight;
  console.log("前", start);
  setTimeout(async () => {
    if (!contentList.data.length) {
      contentList.data = new Array(30).fill({ value: count });
    } else {
      //   contentList.data = [
      //     ...contentList.data,
      //     ...new Array(30).fill({ value: 1 }),
      //   ];
      contentList.data = [
        ...new Array(30).fill({ value: count }),
        ...contentList.data,
      ];
    }
    loading.value = false;
    loadMore.value = false;
    await nextTick();
    const end = scrollRef.value.scrollHeight;
    console.log("后", end);
    console.log("差值", end - start);
    if (count === 1) {
      //首次渲染需要定位到最底部
      scrollRef.value.scrollTo(0, end);
    }
    if (count !== 1) {
      // 上拉加载拿到新数据后需要保留滚动条位置
      scrollRef.value.scrollTo(0, end - start);
    }
    // console.log(...contentList.data);
    console.log(contentList.data);
  }, 500);
};

var intersectionObserver = new IntersectionObserver(function (entries) {
  //   console.log("entries[0]", entries[0]);
  console.log(entries[0].intersectionRatio);

  if (entries[0].intersectionRatio > 0) {
    console.log("完全可见");
    fetchData();
  }
  // If intersectionRatio is 0, the target is out of view
  // and we do not need to do anything.
  if (entries[0].intersectionRatio <= 0) return;

  //   console.log("Loaded new items");
});
// start observing
onMounted(() => {
  intersectionObserver.observe(document.querySelector(".load-more") as Element);
});

let count = 0;
const send = async () => {
  count++;
  const uuid = Math.random();
  const value = content.value;
  const data = { uuid, value, type: "loading" };
  contentList.data.push(data);
  await nextTick();
  scrollRef.value.scrollTo(0, 99999);

  setTimeout(() => {
    console.log("count", count);
    if (count < 3) {
      console.log("发送成功");
      contentList.data.forEach((item, index) => {
        if (item.uuid === uuid) {
          contentList.data[index] = {
            ...contentList.data[index],
            type: "success",
          };
        }
      });
    } else if (3 <= count && count < 6) {
      console.log("发送失败");
      contentList.data.forEach((item, index) => {
        if (item.uuid === uuid) {
          contentList.data[index] = {
            ...contentList.data[index],
            type: "fail",
          };
        }
      });
    } else {
      //   console.log("发送成功");
    }
  }, 100);
};
</script>

<style lang="less" scoped>
.im {
  .content {
    position: relative;
    border: 1px solid #000;
    overflow: auto;
    margin-top: 20px;
    .wrapper {
      height: 300px;
      .load-more {
        // display: none;
        // width: 100%;
        height: 1px;
        // background: #000;
        visibility: hidden;
        &.show {
          height: 20px;
          visibility: visible;
        }
      }
    }
    .loading {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
