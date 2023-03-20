<template>
  <div class="side">
    <!-- <a-button
      type="primary"
      style="margin-bottom: 16px"
      @click="toggleCollapsed"
    >
      <MenuUnfoldOutlined v-if="collapsed" />
      <MenuFoldOutlined v-else />
    </a-button> -->
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      @click="clickMenuItem"
      @openChange="onOpenChange"
    >
      <template v-for="item in list" :key="item.name">
        <template v-if="!item.children && !item.meta.hidden">
          <a-menu-item :key="item.name">
            <template #icon>
              <PieChartOutlined />
            </template>
            {{ item.name }}
          </a-menu-item>
        </template>
        <template v-else-if="!item.meta.hidden">
          <SubMenu :key="item.name" :menu-info="item" />
        </template>
      </template>
    </a-menu>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref, watch } from "vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
} from "@ant-design/icons-vue";
import SubMenu from "./MenuItem.vue";
import { sides } from "@/router/index";
import { useRoute, useRouter } from "vue-router";

// 总体思路
// 1.selectedKeys(等于当前路由的name即可高亮) 用来高亮当前路由，openKeys(当前router所有父路由的name数组)用来展开菜单
// 2.sides为侧边栏路由，每个路由有一个module属性代表是哪个模块的
// 3.watch监听路由变化且立即执行，获取当前页面路由的meta.module，然后去sides找对应的侧边栏数据进行渲染，同时修改selectedKeys，用来高亮当前路由，openKeys用来展开菜单

//侧边栏
const list: any = ref([]);
const collapsed = ref<boolean>(false);
const router = useRouter();
const currentRoute = useRoute();
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

selectedKeys.value = [currentRoute.name] as string[];

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};
const clickMenuItem = ({ key }) => {
  // console.log(key);
  router.push({ name: key });
};

let tempResult: Array<string> = [];
const handleData = (result) => {
  function loop(list: any, keys = []) {
    for (let item of list) {
      if (item.name === currentRoute.name) {
        // 如果路由name与item.name相等则直接返回当前路由的所有上级的name
        tempResult = tempResult.concat([...keys]);
      } else if (item.children && item.children.length) {
        loop(item.children, [...keys, item.name]);
      }
    }
    return tempResult;
  }
  openKeys.value = loop(result);
};

watch(
  () => currentRoute.fullPath,
  () => {
    tempResult = [];
    // console.log("currentRoute", currentRoute);
    // console.log("currentRoute.matched", currentRoute.matched);
    // console.log(currentRoute.matched[0].components?.default?.name);
    for (const item of sides) {
      if (item.module === currentRoute.meta.module) {
        list.value = item.routes;
      }
    }
    // 路由切换的时候更新openKeys的值，不然折叠菜单的高亮不会消失
    handleData(list.value);
    selectedKeys.value = [currentRoute.name] as string[];
    // console.log("list", list);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
.side {
  // width: 100%;
  width: 270px;
  height: 100%;
  .ant-menu {
    height: 100%;
  }
}
</style>
