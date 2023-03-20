<template>
  <a-sub-menu :key="menuInfo.name">
    <template #icon><MailOutlined /></template>
    <template #title>{{ menuInfo.name }}</template>
    <template v-if="!menuInfo.meta.hidden">
      <template v-for="item in menuInfo.children" :key="item.name">
        <template v-if="!item.children">
          <a-menu-item :key="item.name">
            <template #icon>
              <PieChartOutlined />
            </template>
            {{ item.name }}
          </a-menu-item>
        </template>
        <template v-else>
          <sub-menu :menu-info="item" :key="item.name" />
        </template>
      </template>
    </template>
  </a-sub-menu>
</template>

<script lang="ts">
export default {
  name: "SubMenu",
};
</script>
<script setup lang="ts">
import { PieChartOutlined, MailOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  menuInfo: {
    type: Object,
  },
});
</script>
