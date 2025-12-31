<template>
  <main>
    <section>
      <div class="calendar">
        <div class="time-set-out">
          <div v-if="loading" class="tso-msg">加载中...</div>
          
          <div v-else-if="countdownTimer && !countdownTimer.isExpired" class="tso-content">
            <h3 class="tso-title">{{ countdownTimer.title }}</h3>
            <div class="tso-timer">
              <span class="tso-num">{{ countdownTimer.day }}</span><span class="tso-unit">天</span>
              <span class="tso-num">{{ countdownTimer.hour }}</span><span class="tso-unit">时</span>
              <span class="tso-num">{{ countdownTimer.minute }}</span><span class="tso-unit">分</span>
              <span class="tso-num">{{ countdownTimer.second }}</span><span class="tso-unit">秒</span>
            </div>
          </div>

          <div v-else class="tso-msg">
            <h1>{{ nextRestDay ? '好好休息，计时器也休息了' : '今年似乎没有假期了...' }}</h1>
          </div>
        </div>

        <div class="header">
          <button @click="changeMonth(-1)" :disabled="currentMonth === 0">◀</button>
          <span class="month-year">{{ currentMonthYear }}</span>
          <button @click="changeMonth(1)" :disabled="currentMonth === 11">▶</button>
        </div>

        <template v-if="!loading">
          <div class="weekdays">
            <div v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</div>
          </div>

          <div class="days">
            <div
              v-for="day in days"
              :key="day.dateStr"
              :class="[
                'day',
                { inactive: !day.isCurrentMonth },
                { today: day.isToday },
                { weekend: day.isWeekend && day.isCurrentMonth },
                { holiday: day.isHoliday && day.isCurrentMonth },
                { workday: day.isWorkday && day.isCurrentMonth }
              ]"
            >
              <div class="date-num">{{ day.dayNum }}</div>
              
              <div v-if="day.isHoliday" :class="['holiday', { inactive: !day.isCurrentMonth }]">
                {{ day.holidayName }}
              </div>
              
              <div v-else-if="day.isWeekend" :class="['weekend', { inactive: !day.isCurrentMonth }]">
                周末
              </div>
              
              <div v-else-if="day.isWorkday" :class="['workday', { inactive: !day.isCurrentMonth }]">
                调休上班
              </div>
            </div>
          </div>
        </template>
        
        <div class="legend">
          <span><span class="red">“节日”</span>法定节假日</span>
          <span><span class="blue">“调休”</span>需上班</span>
          <span><span class="weekend">“周末”</span>周六日</span>
        </div>
      </div>

      <router-link to="/functions" class="btn" style="display:flex">返回功能</router-link>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { TimeSetOut } from '@/scripts/timeSetOut'; // 引入你的类

// --- 全局变量兼容 ---
declare const swal: any;

// --- 类型定义 ---
type HolidayItem = {
  holiday: boolean;
  name: string;
  date: string;
};

type CalendarDay = {
  dayNum: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  isWorkday: boolean;
  holidayName?: string;
};

// --- 状态 ---
const now = new Date();
const currentYear = ref(2026);
const currentMonth = ref(Math.min(now.getMonth(), 11));
const holidays = ref<Record<string, HolidayItem>>({});
const nextRestDay = ref<{ date: string; name: string } | null>(null);
const loading = ref(true);

// 持有倒计时实例的 ref
const countdownTimer = ref<TimeSetOut | null>(null);

// --- 计算属性 ---
const currentMonthYear = computed(() => {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return `${currentYear.value}年${months[currentMonth.value]}`;
});

const days = computed<CalendarDay[]>(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDayOfMonth = new Date(year, month, 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const result: CalendarDay[] = [];
  const today = new Date();
  const todayStr = toLocalISOString(today);

  for (let i = 0; i < 42; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    const dateStr = toLocalISOString(current);
    const mm = (current.getMonth() + 1).toString().padStart(2, '0');
    const dd = current.getDate().toString().padStart(2, '0');
    const key = `${mm}-${dd}`;

    const isCurrentMonth = current.getMonth() === month;
    const isToday = dateStr === todayStr;

    const dayInfo = holidays.value[key];
    const isHoliday = dayInfo ? dayInfo.holiday === true : false;
    const isWorkday = dayInfo ? dayInfo.holiday === false : false;

    const dayOfWeek = current.getDay();
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6) && !isHoliday && !isWorkday;

    result.push({
      dayNum: current.getDate(),
      dateStr,
      isCurrentMonth,
      isToday,
      isWeekend,
      isHoliday,
      isWorkday,
      holidayName: isHoliday ? dayInfo?.name : undefined
    });
  }
  return result;
});

// --- 方法 ---

function toLocalISOString(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function changeMonth(delta: number) {
  const newVal = currentMonth.value + delta;
  if (newVal >= 0 && newVal <= 11) {
    currentMonth.value = newVal;
  }
}

async function fetchHolidays() {
  loading.value = true;
  try {
    const res = await fetch(`https://timor.tech/api/holiday/year/${currentYear.value}?type=Y`);
    const data = await res.json();
    if (data.code === 0 && data.holiday) {
      holidays.value = data.holiday;
      findNextRestDay(data.holiday);
    }
  } catch (err) {
    console.error('加载失败', err);
  } finally {
    loading.value = false;
    initRestCountdown();
  }
}

function findNextRestDay(holidayMap: Record<string, HolidayItem>) {
  const todayStr = toLocalISOString(new Date());
  
  // 1. 收集明确的节假日
  let candidates = Object.values(holidayMap).map(h => ({
    date: h.date,
    name: h.name,
    isRest: h.holiday === true
  }));

  // 2. 补充未来 60 天的周末
  const tempDate = new Date();
  for(let i=0; i<60; i++) {
    const d = new Date(tempDate);
    d.setDate(tempDate.getDate() + i);
    const dStr = toLocalISOString(d);
    const mmdd = dStr.substring(5);
    
    // 如果已被定义（是节日或调休），跳过
    if (holidayMap[mmdd]) continue;

    const day = d.getDay();
    if (day === 0 || day === 6) {
      candidates.push({ date: dStr, name: '周末', isRest: true });
    }
  }

  candidates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const next = candidates.find(c => c.isRest && c.date >= todayStr); // 改为 >= 包括今天
  
  if (next) {
    // 如果今天就是休息日，倒计时应该指向明天或下一个休息日吗？
    // 逻辑：如果 next.date == todayStr，倒计时结果会是 0，显示“已过期/享受当下”
    nextRestDay.value = { date: next.date, name: next.name };
  }
}

function initRestCountdown() {
  // 1. 清理旧的定时器
  if (countdownTimer.value) {
    countdownTimer.value.stop();
    countdownTimer.value = null;
  }

  if (!nextRestDay.value) return;
  const targetTime = `${nextRestDay.value.date} 00:00:00`;
  
  // 2. 创建新实例 (TimeSetOut 构造函数会自动调用 start)
  // 注意：我们不能在这里调用 useLifecycle()，因为 initRestCountdown 是异步调用的
  // Vue 的生命周期钩子只能在 setup() 同步阶段调用。
  // 所以我们只实例化，并在组件 onUnmounted 时手动 stop。
  countdownTimer.value = new TimeSetOut({
    title: nextRestDay.value.name,
    time: targetTime,
    swal: typeof swal !== 'undefined' ? swal : undefined,
    isAlertExpired: false
  });
}

// --- 生命周期 ---

onMounted(() => {
  fetchHolidays();
});

onUnmounted(() => {
  // 组件销毁时，确保停止定时器
  if (countdownTimer.value) {
    countdownTimer.value.stop();
  }
});
</script>

<style scoped>
/* --- 新的倒计时样式 --- */
.time-set-out {
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

.tso-title {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2em;
  font-weight: normal;
}

.tso-timer {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 5px;
}

.tso-num {
  font-size: 2em;
  font-weight: bold;
  color: #409eff; /* Vue Blue */
  font-family: monospace; /* 保持数字等宽 */
}

.tso-unit {
  font-size: 0.9em;
  color: #666;
  margin-right: 5px;
}

.tso-msg h1 {
  font-size: 1.5em;
  color: #67c23a; /* Success Green */
  margin: 0;
}

.calendar {
  max-width: 800px;
  margin: 10px auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}

.header {
  text-align: center;
  padding: 20px;
  background: #409eff;
  color: white;
}

.header button {
  background: white;
  color: #409eff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.header button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.month-year {
  font-size: 1.5em;
  margin: 0 15px;
  display: inline-block;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  padding: 10px 0;
  background: #f0f0f0;
}

.weekdays div {
  padding: 5px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.day {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  min-height: 80px;
}

.day.inactive,
.day.inactive .holiday,
.day.inactive .weekend,
.day.inactive .workday {
  color: #ccc !important;
  font-size: 0.8em;
}

.day.today {
  background-color: #fef1e5;
  border: 1px solid #ffd7a8;
}
  
.date-num {
  font-size: 1em;
  font-weight: bold;
  margin-bottom: 5px;
}

.holiday {
  font-size: 0.85em;
  color: #d43838;
  margin-top: 2px;
  white-space: nowrap;
}

.workday {
  color: #1989fa;
  font-size: 0.85em;
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #999;
}

.legend {
  padding: 15px;
  text-align: center;
  font-size: 0.9em;
  color: #666;
}

.legend span {
  margin: 0 10px;
}

.red { color: #d43838; }

.blue { color: #1989fa; }

.weekend {
  font-size: 0.85em;
  color: #d234d2;
  margin-top: 2px;
  white-space: nowrap;
}

/* 平板及以下 */
@media (max-width: 798px) {
  .calendar {
    margin: 10px;
    border-radius: 8px;
    overflow: hidden;
  }

  .header {
    padding: 15px 10px;
  }

  .header button {
    padding: 6px 12px;
    font-size: 1em;
  }

  .month-year {
    font-size: 1.3em;
  }

  .weekdays div {
    padding: 4px;
    font-size: 0.9em;
  }

  .day {
    padding: 12px 5px;
    min-height: 60px;
    font-size: 0.9em;
  }

  .date-num {
    font-size: 0.95em;
    margin-bottom: 2px;
  }

  .holiday, .workday, .weekend {
    font-size: 0.75em !important;
    margin-top: 1px;
  }

  .legend {
    font-size: 0.8em;
    padding: 10px;
  }

  .legend span {
    display: inline-block;
    margin: 3px 8px;
    white-space: nowrap;
  }

}

/* 手机端（小屏） */
@media (max-width: 599.98px) {
  .calendar {
    margin: 8px 4px;
    border-radius: 6px;
  }

  .header {
    padding: 12px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .header button {
    font-size: 1.1em;
    padding: 8px 16px;
    min-width: 40px;
  }

  .month-year {
    font-size: 1.2em;
    margin: 0;
    text-align: center;
  }

  .weekdays {
    font-size: 0.85em;
  }

  .weekdays div {
    padding: 3px;
  }

  .days {
    /* 确保手机上每行刚好7个 */
    grid-template-columns: repeat(7, 1fr);
  }

  .day {
    padding: 10px 2px;
    min-height: 50px;
    line-height: 1.3;
  }

  .date-num {
    font-size: 0.9em;
    font-weight: bold;
  }

  .holiday, .workday, .weekend {
    font-size: 0.7em !important;
    margin-top: 1px;
    white-space: normal; /* 允许换行 */
  }

  .workday {
    font-weight: normal; /* 避免太粗 */
  }

  .legend {
    font-size: 0.75em;
    padding: 8px;
    line-height: 1.4;
  }

  .legend span {
    display: block;
    margin: 4px 0;
    text-align: center;
  }

  /* 可选：在极小屏隐藏图例文字 */
  @media (max-width: 414px) {
    .legend {
      font-size: 0.7em;
      padding: 6px;
    }
    .legend span {
      margin: 3px 0;
    }
  }
}
</style>