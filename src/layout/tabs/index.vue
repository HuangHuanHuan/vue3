<template>
  <div class="tabs">
    <a-tabs
      v-model:activeKey="activeKey"
      hide-add
      type="editable-card"
      @change="tabChange"
      @edit="tabEdit"
    >
      <a-tab-pane
        v-for="pane in panes"
        :key="pane.key"
        :tab="pane.title"
        :closable="true"
      >
      </a-tab-pane>
      <template #rightExtra>
        <Dropdown :trigger="['click']" placement="bottomRight">
          <a class="arrow-down" @click.prevent>
            <down-outlined :style="{ fontSize: '14px' }" />
          </a>
          <!-- <template #overlay>
            <Menu style="user-select: none">
              <Menu.Item key="2">
                <close-outlined />
                关闭标签页
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="5">
                <column-width-outlined />
                关闭其他标签页
              </Menu.Item>
              <Menu.Item key="6">
                <minus-outlined />
                关闭全部标签页
              </Menu.Item>
            </Menu>
          </template> -->
        </Dropdown>
      </template>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DownOutlined } from "@ant-design/icons-vue";

const panes: any = ref([]);
const activeKey = ref("");
const currentRoute = useRoute();
const router = useRouter();

watch(
  () => currentRoute.fullPath,
  () => {
    // console.log("currentRoute", currentRoute);
    const { fullPath, name } = currentRoute;
    activeKey.value = fullPath;
    const isExit = panes.value.some((item: any) => item.key === fullPath);
    if (!isExit) {
      panes.value = [...panes.value, { key: fullPath, title: name }];
    }
  },
  {
    immediate: true,
  }
);

const tabChange = (key: string) => {
  // console.log("tabChange");
  router.push(key);
};
const tabEdit = (targetKey: string, action: string) => {
  if (panes.value.length === 1) {
    message.warn("最后一页无法关闭");
    return;
  }
  // console.log("targetKey", targetKey);
  // console.log("action", action);
  if (action === "remove") {
    if (activeKey.value === targetKey) {
      // 删除的就是当前页的路由
      panes.value = panes.value.filter((item: any) => item.key !== targetKey);
      activeKey.value = panes.value[panes.value.length - 1].key;
      router.push(activeKey.value);
      // const deleteIndex = panes.value.findIndex(
      //   (item: any) => item.key === targetKey
      // );
    } else {
      // 删除其他页的路由
      panes.value = panes.value.filter((item: any) => item.key !== targetKey);
    }
  }
};
</script>

<style lang="less" scoped>
.tabs {
  .ant-tabs-tab {
    background: #fff;
  }
}
</style>
