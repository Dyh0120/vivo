// vitest.config.ts
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { mergeConfig, defineConfig as defineConfig2, configDefaults } from "file:///C:/Users/27250/OneDrive/%E8%93%9D%E6%97%AD%E9%A1%B9%E7%9B%AE%E5%A4%87%E4%BB%BD/f%E8%93%9D%E6%97%AD%E6%A1%86%E6%9E%B6/framework/framework/node_modules/vitest/dist/config.js";

// vite.config.ts
import { fileURLToPath, URL as URL2 } from "node:url";
import { defineConfig } from "file:///C:/Users/27250/OneDrive/%E8%93%9D%E6%97%AD%E9%A1%B9%E7%9B%AE%E5%A4%87%E4%BB%BD/f%E8%93%9D%E6%97%AD%E6%A1%86%E6%9E%B6/framework/framework/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/27250/OneDrive/%E8%93%9D%E6%97%AD%E9%A1%B9%E7%9B%AE%E5%A4%87%E4%BB%BD/f%E8%93%9D%E6%97%AD%E6%A1%86%E6%9E%B6/framework/framework/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/27250/OneDrive/%E8%93%9D%E6%97%AD%E9%A1%B9%E7%9B%AE%E5%A4%87%E4%BB%BD/f%E8%93%9D%E6%97%AD%E6%A1%86%E6%9E%B6/framework/framework/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueDevTools from "file:///C:/Users/27250/OneDrive/%E8%93%9D%E6%97%AD%E9%A1%B9%E7%9B%AE%E5%A4%87%E4%BB%BD/f%E8%93%9D%E6%97%AD%E6%A1%86%E6%9E%B6/framework/framework/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/27250/OneDrive/%E8%93%9D%E6%97%AD%E9%A1%B9%E7%9B%AE%E5%A4%87%E4%BB%BD/f%E8%93%9D%E6%97%AD%E6%A1%86%E6%9E%B6/framework/framework/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL2("./src", __vite_injected_original_import_meta_url))
    }
  }
});

// vitest.config.ts
var __vite_injected_original_import_meta_url2 = "file:///C:/Users/27250/OneDrive/%E8%93%9D%E6%97%AD%E9%A1%B9%E7%9B%AE%E5%A4%87%E4%BB%BD/f%E8%93%9D%E6%97%AD%E6%A1%86%E6%9E%B6/framework/framework/vitest.config.ts";
var vitest_config_default = mergeConfig(
  vite_config_default,
  defineConfig2({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath2(new URL("./", __vite_injected_original_import_meta_url2))
    }
  })
);
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDI3MjUwXFxcXE9uZURyaXZlXFxcXFx1ODRERFx1NjVFRFx1OTg3OVx1NzZFRVx1NTkwN1x1NEVGRFxcXFxmXHU4NEREXHU2NUVEXHU2ODQ2XHU2N0I2XFxcXGZyYW1ld29ya1xcXFxmcmFtZXdvcmtcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDI3MjUwXFxcXE9uZURyaXZlXFxcXFx1ODRERFx1NjVFRFx1OTg3OVx1NzZFRVx1NTkwN1x1NEVGRFxcXFxmXHU4NEREXHU2NUVEXHU2ODQ2XHU2N0I2XFxcXGZyYW1ld29ya1xcXFxmcmFtZXdvcmtcXFxcdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvMjcyNTAvT25lRHJpdmUvJUU4JTkzJTlEJUU2JTk3JUFEJUU5JUExJUI5JUU3JTlCJUFFJUU1JUE0JTg3JUU0JUJCJUJEL2YlRTglOTMlOUQlRTYlOTclQUQlRTYlQTElODYlRTYlOUUlQjYvZnJhbWV3b3JrL2ZyYW1ld29yay92aXRlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQgeyBtZXJnZUNvbmZpZywgZGVmaW5lQ29uZmlnLCBjb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXHJcbmltcG9ydCB2aXRlQ29uZmlnIGZyb20gJy4vdml0ZS5jb25maWcnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyhcclxuICB2aXRlQ29uZmlnLFxyXG4gIGRlZmluZUNvbmZpZyh7XHJcbiAgICB0ZXN0OiB7XHJcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgICBleGNsdWRlOiBbLi4uY29uZmlnRGVmYXVsdHMuZXhjbHVkZSwgJ2UyZS8qKiddLFxyXG4gICAgICByb290OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICB9LFxyXG4gIH0pLFxyXG4pXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcMjcyNTBcXFxcT25lRHJpdmVcXFxcXHU4NEREXHU2NUVEXHU5ODc5XHU3NkVFXHU1OTA3XHU0RUZEXFxcXGZcdTg0RERcdTY1RURcdTY4NDZcdTY3QjZcXFxcZnJhbWV3b3JrXFxcXGZyYW1ld29ya1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcMjcyNTBcXFxcT25lRHJpdmVcXFxcXHU4NEREXHU2NUVEXHU5ODc5XHU3NkVFXHU1OTA3XHU0RUZEXFxcXGZcdTg0RERcdTY1RURcdTY4NDZcdTY3QjZcXFxcZnJhbWV3b3JrXFxcXGZyYW1ld29ya1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvMjcyNTAvT25lRHJpdmUvJUU4JTkzJTlEJUU2JTk3JUFEJUU5JUExJUI5JUU3JTlCJUFFJUU1JUE0JTg3JUU0JUJCJUJEL2YlRTglOTMlOUQlRTYlOTclQUQlRTYlQTElODYlRTYlOUUlQjYvZnJhbWV3b3JrL2ZyYW1ld29yay92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuXHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICB2dWVEZXZUb29scygpLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH0sXHJcbiAgfSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4YixTQUFTLGlCQUFBQSxzQkFBcUI7QUFDNWQsU0FBUyxhQUFhLGdCQUFBQyxlQUFjLHNCQUFzQjs7O0FDRGdZLFNBQVMsZUFBZSxPQUFBQyxZQUFXO0FBRTdkLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxpQkFBaUI7QUFMK00sSUFBTSwyQ0FBMkM7QUFReFIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJQyxLQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7OztBRG5Cd08sSUFBTUMsNENBQTJDO0FBSTFSLElBQU8sd0JBQVE7QUFBQSxFQUNiO0FBQUEsRUFDQUMsY0FBYTtBQUFBLElBQ1gsTUFBTTtBQUFBLE1BQ0osYUFBYTtBQUFBLE1BQ2IsU0FBUyxDQUFDLEdBQUcsZUFBZSxTQUFTLFFBQVE7QUFBQSxNQUM3QyxNQUFNQyxlQUFjLElBQUksSUFBSSxNQUFNRix5Q0FBZSxDQUFDO0FBQUEsSUFDcEQ7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFsiZmlsZVVSTFRvUGF0aCIsICJkZWZpbmVDb25maWciLCAiVVJMIiwgIlVSTCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsIiwgImRlZmluZUNvbmZpZyIsICJmaWxlVVJMVG9QYXRoIl0KfQo=
