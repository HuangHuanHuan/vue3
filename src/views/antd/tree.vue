<template>
  <a-tree
    v-model:selectedKeys="selectedKeys"
    :defaultExpandAll="true"
    :tree-data="treeData"
  >
    <template #title="{ key: treeKey, title }">
      <span>{{ title }}</span>
      <a-button type="text" @click="addSub(treeKey)">增加</a-button>
    </template>
  </a-tree>
  <a-input v-model:value="a"></a-input>
</template>

<script lang="ts">
export default {
  name: "tree",
};
</script>

<script setup lang="ts">
import { ref } from "vue";

const a = ref("");
const treeData = ref([
  {
    title: "0-0",
    key: "0-0",
    children: [
      {
        title: "0-0-0",
        key: "0-0-0",
        children: [
          { title: "0-0-0-0", key: "0-0-0-0" },
          { title: "0-0-0-1", key: "0-0-0-1" },
          { title: "0-0-0-2", key: "0-0-0-2" },
        ],
      },
      {
        title: "0-0-1",
        key: "0-0-1",
        children: [
          { title: "0-0-1-0", key: "0-0-1-0" },
          { title: "0-0-1-1", key: "0-0-1-1" },
          { title: "0-0-1-2", key: "0-0-1-2" },
        ],
      },
    ],
  },
]);

const selectedKeys = ref<string[]>(["0-0-0"]);

const addSub = (treeKey: string) => {
  console.log("treeKey", treeKey);
  const item = getTreeDataByKey(treeData.value, treeKey);
  if (!item.children) {
    item.children = [];
  }
  let key = Math.random();
  item.children.push({
    title: 111,
    key,
  });
  //   expandedKeys.value = [...expandedKeys.value, key + ""];
  console.log("item", item);
  console.log("selectedKeys.value", selectedKeys.value);
};

// 根据key获取与之相等的数据对象
function getTreeDataByKey(childs = [], findKey) {
  let finditem = null;
  for (let i = 0, len = childs.length; i < len; i++) {
    let item = childs[i];
    if (item.key !== findKey && item.children && item.children.length > 0) {
      finditem = getTreeDataByKey(item.children, findKey);
    }
    if (item.key == findKey) {
      finditem = item;
    }
    if (finditem != null) {
      break;
    }
  }
  return finditem;
}
// 根据key获取父级节点children数组
function getTreeParentChilds(childs = [], findKey) {
  let parentChilds = [];
  for (let i = 0, len = childs.length; i < len; i++) {
    let item = childs[i];
    if (item.key !== findKey && item.children && item.children.length > 0) {
      parentChilds = getTreeParentChilds(item.children, findKey);
    }
    if (item.key == findKey) {
      parentChilds = childs;
    }
    if (parentChilds.length > 0) {
      break;
    }
  }
  return parentChilds;
}
</script>

<style lang="less" scoped></style>
