import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@function-ui/packages/utils": fileURLToPath(
        new URL("./function-ui/packages/utils/index.ts", import.meta.url)
      ),
      "@function-ui/packages/components": fileURLToPath(
        new URL("./function-ui/packages/components/index.ts", import.meta.url)
      ),
    },
  },
});
