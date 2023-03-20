<template>
  <div class="wrapper">
    <!-- list-{{ list }} -->
    <div class="header">
      <div class="modules">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          @click="menuClick"
        >
          <a-menu-item v-for="item in modules" :key="item.name">
            {{ item.title }}
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <div class="main">
      <div class="aside">
        <SideMenu></SideMenu>
      </div>
      <div class="content">
        <!-- <a-breadcrumb>
          <a-breadcrumb-item v-for="item in breadcrumb" :key="item.name">{{
            item.name
          }}</a-breadcrumb-item>
        </a-breadcrumb> -->
        <a-breadcrumb :routes="routes">
          <template #itemRender="{ route }">
            <span v-if="routes.indexOf(route) === routes.length - 1">
              {{ route.name }}
            </span>
            <a v-else @click="router.push({ name: route.name })">
              {{ route.name }}
            </a>
          </template>
        </a-breadcrumb>
        <Tabs></Tabs>
        <router-view v-slot="{ Component }">
          <keep-alive :include="[...list]">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "HomeView",
};
</script>

<script setup lang="ts">
import SideMenu from "@/layout/menu/index.vue";
import { modules, sides } from "@/router/index";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Tabs from "@/layout/tabs/index.vue";
import type { RouteLocationNormalized } from "vue-router";
import { useKeepAliveSotre } from "@/stores/keepAlive";

const selectedKeys = ref<Array<string>>([]);
const currentRoute = useRoute();
const routes: any = ref([]);
// console.log("currentRoute", currentRoute);

const router = useRouter();
const { list, addName } = useKeepAliveSotre();

function setkeys() {
  selectedKeys.value = [currentRoute.meta.module as string];
  // for (const item of sides) {
  //   if (item.module === currentRoute.meta.module) {
  //     selectedKeys.value = [item.module];
  //   }
  // }
}

//根据name从菜单中找到对应的route
function getRouteByName(routes: any, name: string): any {
  let findRoute;
  console.log("name", name);

  for (const route of routes) {
    console.log("route.name", route.name);

    if (route.name === name) {
      findRoute = route;
      return findRoute;
    } else if (route.children) {
      findRoute = getRouteByName(route.children, name);
    }
  }
  return findRoute;
}

function handleRoute(name: string) {
  let findRoute: any = [];
  for (const item of sides) {
    if (item.routes && !findRoute.length) {
      findRoute = findRoute.concat(getRouteByName(item.routes, name));
      findRoute = findRoute.filter(Boolean);
    }
  }
  console.log("findRoute", findRoute);
  return findRoute;
}

function getBreadcrumb() {
  console.log("currentRoute", currentRoute);
  const {
    meta: { breadCrumb },
  } = currentRoute as any;
  console.log("breadCrumb", breadCrumb);
  let breadCrumbs: any = [];
  if (breadCrumb) {
    for (const item of breadCrumb) {
      // title即为路由name
      const { title } = item;
      breadCrumbs = breadCrumbs.concat(handleRoute(title));
    }
    routes.value = breadCrumbs;
    console.log("routes", routes);
  }

  // const routes = currentRoute.matched;
  // for (const item of routes) {
  //   if (item.meta?.title) {
  //     breadcrumb.value = [...breadcrumb.value, item];
  //   }
  // }
  // console.log("currentRoute.matched", currentRoute.matched);
}

const menuClick = ({ key }: { key: string }) => {
  // console.log("key", key);
  let routes;
  for (const item of sides) {
    if (item.module === key) {
      routes = item.routes;
    }
  }

  function searchName(routes: any) {
    for (const item of routes) {
      let name = item.name;
      if (item.children) {
        name = searchName(item.children);
      }
      return name;
    }
  }
  const routeName = searchName(routes);
  router.push({ name: routeName });
};

const getComponentName = (toRoute: RouteLocationNormalized): string => {
  // matched数组对象中的components可以拿到路由对应的组件名称
  return currentRoute.matched.find((route) => route.name === toRoute.name)
    ?.components?.default?.name!;
};

watch(
  () => currentRoute.fullPath,
  () => {
    routes.value = [];
    setkeys();
    getBreadcrumb();
    const componentName = getComponentName(currentRoute);
    console.log("componentName", componentName);
    // 将组件name加入到keepalive中达到页面缓存的效果
    addName(componentName);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
.wrapper {
  height: 100%;
  .header {
    // height: 100px;
    .modules {
      margin-left: 300px;
    }
  }
  .main {
    display: flex;
    height: 100%;
    .aside {
      width: 300px;
      height: 100%;
    }
    .content {
      flex: 1;
    }
  }
}
</style>
