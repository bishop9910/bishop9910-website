// shims-vue.d.ts

// 声明模块
declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // 定义组件的类型：
  // 1. Props ({} - 这里是空对象，表示没有 props，但 AudioPlayer 有 props，所以这里应该更通用)
  // 2. 原始绑定 ({} - 默认没有原始绑定)
  // 3. 实例类型 (any)
  const component: DefineComponent<{}, {}, any>;
  
  // 导出组件
  export default component;
}