// vite.config.js
import { defineConfig } from "file:///home/kavia/workspace/code-generation/simple-notes-app-46906-46915/notes_frontend/node_modules/vite/dist/node/index.js";
import blitsVitePlugins from "file:///home/kavia/workspace/code-generation/simple-notes-app-46906-46915/notes_frontend/node_modules/@lightningjs/blits/vite/index.js";
var vite_config_default = defineConfig(({ command, mode, ssrBuild }) => {
  return {
    base: "/",
    plugins: [...blitsVitePlugins],
    resolve: {
      mainFields: ["browser", "module", "jsnext:main", "jsnext"]
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: [".kavia.ai"],
      port: Number(process.env.VITE_PORT || 3e3),
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp"
      },
      fs: {
        allow: [".."]
      }
    },
    worker: {
      format: "es"
    },
    define: {
      "import.meta.env.VITE_API_BASE": JSON.stringify(process.env.VITE_API_BASE || ""),
      "import.meta.env.VITE_BACKEND_URL": JSON.stringify(process.env.VITE_BACKEND_URL || "")
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9rYXZpYS93b3Jrc3BhY2UvY29kZS1nZW5lcmF0aW9uL3NpbXBsZS1ub3Rlcy1hcHAtNDY5MDYtNDY5MTUvbm90ZXNfZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2thdmlhL3dvcmtzcGFjZS9jb2RlLWdlbmVyYXRpb24vc2ltcGxlLW5vdGVzLWFwcC00NjkwNi00NjkxNS9ub3Rlc19mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9rYXZpYS93b3Jrc3BhY2UvY29kZS1nZW5lcmF0aW9uL3NpbXBsZS1ub3Rlcy1hcHAtNDY5MDYtNDY5MTUvbm90ZXNfZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjsvKiBlc2xpbnQtZGlzYWJsZSAqL1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlL2NsaWVudFwiIC8+XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgYmxpdHNWaXRlUGx1Z2lucyBmcm9tICdAbGlnaHRuaW5nanMvYmxpdHMvdml0ZSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUsIHNzckJ1aWxkIH0pID0+IHtcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiAnLycsXG4gICAgcGx1Z2luczogWy4uLmJsaXRzVml0ZVBsdWdpbnNdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIG1haW5GaWVsZHM6IFsnYnJvd3NlcicsICdtb2R1bGUnLCAnanNuZXh0Om1haW4nLCAnanNuZXh0J10sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgIGFsbG93ZWRIb3N0czogWycua2F2aWEuYWknXSxcbiAgICAgIHBvcnQ6IE51bWJlcihwcm9jZXNzLmVudi5WSVRFX1BPUlQgfHwgMzAwMCksXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeSc6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICdDcm9zcy1PcmlnaW4tRW1iZWRkZXItUG9saWN5JzogJ3JlcXVpcmUtY29ycCcsXG4gICAgICB9LFxuICAgICAgZnM6IHtcbiAgICAgICAgYWxsb3c6IFsnLi4nXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICB3b3JrZXI6IHtcbiAgICAgIGZvcm1hdDogJ2VzJyxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0FQSV9CQVNFJzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuVklURV9BUElfQkFTRSB8fCAnJyksXG4gICAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfQkFDS0VORF9VUkwnOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5WSVRFX0JBQ0tFTkRfVVJMIHx8ICcnKSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUdBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sc0JBQXNCO0FBRTdCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxNQUFNLFNBQVMsTUFBTTtBQUMzRCxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixTQUFTLENBQUMsR0FBRyxnQkFBZ0I7QUFBQSxJQUM3QixTQUFTO0FBQUEsTUFDUCxZQUFZLENBQUMsV0FBVyxVQUFVLGVBQWUsUUFBUTtBQUFBLElBQzNEO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixjQUFjLENBQUMsV0FBVztBQUFBLE1BQzFCLE1BQU0sT0FBTyxRQUFRLElBQUksYUFBYSxHQUFJO0FBQUEsTUFDMUMsU0FBUztBQUFBLFFBQ1AsOEJBQThCO0FBQUEsUUFDOUIsZ0NBQWdDO0FBQUEsTUFDbEM7QUFBQSxNQUNBLElBQUk7QUFBQSxRQUNGLE9BQU8sQ0FBQyxJQUFJO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixpQ0FBaUMsS0FBSyxVQUFVLFFBQVEsSUFBSSxpQkFBaUIsRUFBRTtBQUFBLE1BQy9FLG9DQUFvQyxLQUFLLFVBQVUsUUFBUSxJQUFJLG9CQUFvQixFQUFFO0FBQUEsSUFDdkY7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
