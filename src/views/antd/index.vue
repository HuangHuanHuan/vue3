<template>
  <div>
    <a-transfer
      v-model:target-keys="targetKeys"
      v-model:selected-keys="selectedKeys"
      :data-source="mockData"
      :titles="['Source', 'Target']"
      :render="(item) => item.title"
      :disabled="disabled"
      @change="handleChange"
      @selectChange="handleSelectChange"
      @scroll="handleScroll"
    />
    <a-switch
      v-model:checked="disabled"
      un-checked-children="enabled"
      checked-children="disabled"
      style="margin-top: 16px"
    />

    <a-input v-model:value="a"></a-input>
  </div>
</template>

<script lang="ts">
export default {
  name: "transfer",
};
</script>

<script setup lang="ts">
import { ref } from "vue";

interface MockData {
  key: string;
  title: string;
  description: string;
  disabled: boolean;
}
const a = ref("");
const mockData: MockData[] = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
  });
}

// console.log("mockData", mockData);

const oriTargetKeys = mockData
  .filter((item) => +item.key % 3 > 1)
  .map((item) => item.key);
const disabled = ref<boolean>(false);

// console.log("oriTargetKeys", oriTargetKeys);

// 显示在右侧框数据的 key 集合
const targetKeys = ref<string[]>(oriTargetKeys);

const selectedKeys = ref<string[]>(["1", "4"]);

const handleChange = (
  nextTargetKeys: string[],
  direction: string,
  moveKeys: string[]
) => {
  console.log("targetKeys: ", nextTargetKeys);
  console.log("direction: ", direction);
  console.log("moveKeys: ", moveKeys);
};
const handleSelectChange = (
  sourceSelectedKeys: string[],
  targetSelectedKeys: string[]
) => {
  console.log("sourceSelectedKeys: ", sourceSelectedKeys);
  console.log("targetSelectedKeys: ", targetSelectedKeys);
};
const handleScroll = (direction: string, e: Event) => {
  //   console.log("direction:", direction);
  //   console.log("target:", e.target);
};
</script>

<style lang="less" scoped>
.ant-tree-title {
  .ant-btn {
    visibility: hidden;
  }
  &:hover {
    .ant-btn {
      visibility: visible;
    }
  }
}
</style>
