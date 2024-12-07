// https://vitepress.dev/guide/custom-theme
import { h, nextTick, onMounted, watch } from "vue";
import { inBrowser, useRoute, type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";
import confetti from "./components/confetti.vue";
import busuanzi from "busuanzi.pure.js";
import VisitorPanel from "./components/VisitorPanel.vue";
import mediumZoom from "medium-zoom";
import vitepressNprogress from "vitepress-plugin-nprogress";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import DemoPreview, { useComponents } from "@vitepress-code-preview/container";
import { Sandbox } from "vitepress-plugin-sandpack";

import "virtual:group-icons.css";
import "vitepress-plugin-nprogress/lib/css/index.css";
import "@vitepress-code-preview/container/dist/style.css";
import "vitepress-plugin-sandpack/dist/style.css";
import Layout from "./Layout.vue";
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp(ctx) {
    const { app, router, siteData } = ctx;
    vitepressNprogress(ctx);

    enhanceAppWithTabs(app);
    useComponents(ctx.app, DemoPreview);
    app.component("Sandbox", Sandbox);

    app.component("confetti", confetti);
    app.component("VisitorPanel", VisitorPanel);
    if (inBrowser) {
      router.onAfterRouteChanged = () => {
        busuanzi.fetch();
      };
    }
    // ...
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
} satisfies Theme;
