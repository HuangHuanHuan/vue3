import { defineStore } from "pinia";
import { ref } from "vue";

interface keepAliveState {
  name: string;
}

export const useKeepAliveSotre = defineStore("keep-alive", () => {
  // 用来存放需要keepalive的组件name
  const list = ref<Array<string>>([]);
  const addName = (name: string) => {
    if (!list.value.includes(name)) {
      list.value.push(name);
    }
  };
  const removeName = (name: string) => {
    list.value = list.value.filter((item) => item !== name);
  };

  return {
    list,
    addName,
    removeName,
  };
});
