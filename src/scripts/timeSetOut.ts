// @/scripts/TimeSetOut.ts
import type { SweetAlert } from 'sweetalert/typings/core';
import { ref, type Ref, onMounted, onUnmounted } from 'vue';

export interface TimeSetOutOptions {
  title: string;
  time: string; // ISO 或 'YYYY-MM-DD HH:mm:ss'
  swal?: SweetAlert; // 兼容 Swal 或自定义 swal
}

export class TimeSetOut {
  public title: Ref<string>;
  public day: Ref<string>;
  public hour: Ref<string>;
  public minute: Ref<string>;
  public second: Ref<string>;
  public isExpired: Ref<boolean>;
  public remainingMs: Ref<number>;

  private timer: number | null = null;
  private inputTime: number;
  private options: TimeSetOutOptions;

  constructor(options: TimeSetOutOptions) {
    this.options = options;

    // 初始化响应式状态
    this.title = ref(`距${options.title}还有`);
    this.day = ref('00');
    this.hour = ref('00');
    this.minute = ref('00');
    this.second = ref('00');
    this.isExpired = ref(false);
    this.remainingMs = ref(0);

    this.inputTime = 0;

    // 解析目标时间
    const date = new Date(options.time);
    if (isNaN(date.getTime())) {
      console.error('[TimeSetOut] 无效时间:', options.time);
      this.isExpired.value = true;
      return;
    }
    this.inputTime = date.getTime();

    // 启动倒计时（配合生命周期管理）
    this.start();
  }

  private formatUnit(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  private update() {
    const now = Date.now();
    const diff = this.inputTime - now;

    this.remainingMs.value = diff;

    if (diff <= 0) {
      this.isExpired.value = true;
      this.stop();
      this.onExpired();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    this.day.value = this.formatUnit(d);
    this.hour.value = this.formatUnit(h);
    this.minute.value = this.formatUnit(m);
    this.second.value = this.formatUnit(s);
  }

  private onExpired() {
    const { swal } = this.options;
    if (swal) {
      swal({
        icon: 'error',
        title: '错误',
        text: '倒计时已过时，无法进行倒计时，请重新设置时间。',
      });
    } else {
      alert('倒计时已过时，无法进行倒计时，请重新设置时间。');
    }
  }

  start() {
    this.update();
    this.timer = window.setInterval(() => {
      this.update();
    }, 1000);
  }

  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Vue 生命周期钩子辅助函数（在 setup 中调用）
  useLifecycle() {
    onMounted(() => {
      if (!this.timer) this.start();
    });
    onUnmounted(() => {
      this.stop();
    });
  }
}