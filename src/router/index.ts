import { createRouter, createWebHistory } from "vue-router";
import RouterView from "@/layout/routerView/index.vue";

const sides = [
  {
    module: "home",
    routes: [
      {
        path: "echarts",
        name: "echarts",
        component: "../views/echarts/index",
        // component: () => import("../views/echarts/index.vue"),
        meta: {
          title: "echarts",
          roles: ["super", "admin"],
        },
      },
      {
        path: "im",
        name: "im",
        component: "../views/im/index",
        // component: () => import("../views/im/index.vue"),
        meta: {
          title: "im",
          roles: ["super"],
        },
      },
      {
        path: "antd",
        name: "antd",
        component: "RouterView",
        // component: RouterView,
        meta: {
          roles: ["antd"],
        },
        children: [
          {
            path: "index",
            name: "index",
            component: "RouterView",
            // component: RouterView,
            children: [
              {
                path: "test",
                name: "test",
                component: "../views/antd/index",
                // component: () => import("../views/antd/index.vue"),
                meta: {
                  title: "test",
                  roles: ["antd", "test"],
                },
              },
            ],
          },
          {
            path: "tree",
            name: "tree",
            component: "../views/antd/tree",
            // component: () => import("../views/antd/tree.vue"),
            meta: {
              title: "tree",
              roles: ["antd", "tree"],
            },
          },
        ],
      },
    ],
  },
  {
    module: "other",
    routes: [
      {
        path: "other",
        name: "other",
        component: "RouterView",
        // component: RouterView,
        children: [
          {
            path: "mock",
            name: "mock",
            component: "../views/mock/index",
            // component: () => import("../views/mock/index.vue"),
          },
        ],
      },
    ],
  },
];

const views = import.meta.glob("../views/**/**.vue");
// console.log("views", views);

// 给每个路由添加meta.module属性，代表属于哪个模块
function generateSides(item: any, routes: any) {
  for (const route of routes) {
    if (!route.meta) {
      route.meta = {};
    }
    route.meta.module = item.module;
    if (route.children) {
      generateSides(item, route.children);
    }
  }
}

const roles = ["admin", "super", "antd"];

// 通过hidden属性判断侧边栏菜单是否展示
function filterRoute(routes: any) {
  for (const route of routes) {
    if (route.meta.roles) {
      const isShow = route.meta.roles.some((role: string) => {
        return roles.includes(role);
      });
      route.meta.hidden = !isShow;
      if (route.children) {
        filterRoute(route.children);
      }
    } else {
      route.meta.hidden = false;
      if (route.children) {
        filterRoute(route.children);
      }
    }
  }
}

// 模拟后台返回路由数据 动态生成component
function generateRoutes(routes: any) {
  for (const route of routes) {
    if (route.component === "RouterView") {
      route.component = RouterView;
    } else {
      route.component = views[`${route.component}.vue`];
    }
    if (route.children) {
      generateRoutes(route.children);
    }
  }
}

function handleRoute() {
  for (const item of sides) {
    if (item.routes) {
      generateRoutes(item.routes);
      generateSides(item, item.routes);
      filterRoute(item.routes);
    }
  }
}
handleRoute();

// console.log("sides", sides);

const modules = [
  {
    title: "首页",
    name: "home",
  },
  {
    title: "其他",
    name: "other",
  },
];

// 将路由扁平化为一级路由，并给每个路由的meta添加breadCrumb属性用来做面包屑（扁平未为一级路由后，router.matched没法正确获得面包屑）
function flatten(routes: any, parentPath?: string, parentRoute?: any) {
  let newRoutes: any = [];
  for (const item of routes) {
    const breadCrumb: any = [];
    if (!item.children) {
      const route = parentPath
        ? { ...item, path: `${parentPath}/${item.path}` }
        : item;
      if (parentRoute) {
        for (const item of parentRoute) {
          breadCrumb.push({ title: item.name });
        }
      }
      breadCrumb.push({ title: route.name });
      route.meta.breadCrumb = breadCrumb;
      newRoutes.push(route);
    } else {
      newRoutes = [
        ...newRoutes,
        ...flatten(
          item.children,
          parentPath ? `${parentPath}/${item.path}` : item.path,
          parentRoute ? [...parentRoute, item] : [item]
        ),
      ];
    }
  }
  return newRoutes;
}

const flattenRoutes = () => {
  let routes: any = [];
  for (const item of sides) {
    if (item.routes) {
      routes = [...routes, ...flatten(item.routes)];
    }
  }
  return routes;
};

// flattenRoutes();

// console.log("newRoutes", newRoutes);

function getOtherRoutes() {
  let routes: any = [];
  for (const item of sides) {
    routes = routes.concat(item.routes);
  }
  return routes;
}

// 不扁平化路由
// const otherRoutes = getOtherRoutes();
// 扁平化路由 解决keep-alive只能缓存两级路由的问题
const otherRoutes = flattenRoutes();
console.log("otherRoutes", otherRoutes);
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: {
      title: "首页",
    },
    children: [
      {
        path: "",
        name: "welcome",
        component: () => import("../views/welcome.vue"),
        meta: {
          module: "home",
        },
      },
      // ...otherRoutes,
    ],
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // console.log("to", to);
  // console.log("router.getRoutes", router.getRoutes());
  const layout = routes.find((item) => item.name == "home");
  // console.log("layout", layout);
  if (layout?.children?.length === 1) {
    layout.children = [...layout.children, ...otherRoutes];
    // 模拟接口请求数据后再动态添加路由
    await new Promise((resolve, reject) => {
      router.addRoute(layout);
      console.log(router.getRoutes());

      resolve(1);
    });
    // console.log("router.getRoutes", router.getRoutes());
    next({ ...to, replace: true });
  } else {
    next();
  }
});

export default router;
export { sides, modules };
