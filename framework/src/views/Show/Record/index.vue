<template>
  <div class="history-page">
    <!-- 日期选择器 -->
    <div class="date-picker-container">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        placeholder="选择日期"
        @change="handleDateChange"
        @panel-change="handlePanelChange"
      :disabled-date="disabledDate"
      :cell-class-name="getCellClassName"
        class="custom-date-picker"
      ></el-date-picker>
    </div>
    
    <div class="dialogue-container">
      <div v-if="dialogueInfo.length === 0" class="empty-state">
        <el-empty description="暂无历史对话记录" />
      </div>
      <transition-group name="dialogue-list" tag="div">
        <div class="dialogue-item" v-for="item in dialogueInfo" :key="item.create_time">
          <div class="dialogue-header">
            <div class="model-badge">{{ item.model }}</div>
            <span class="time-stamp">{{ item.create_time }}</span>
          </div>
          <div class="dialogue-content">
            <div class="question-section">
              <div class="label">问题</div>
              <p class="question-text">{{ item.question }}</p>
            </div>
            <div class="answer-section">
              <div class="label">回答</div>
              <p class="answer-text">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed,onMounted  } from 'vue';
import axios from 'axios';
const token = localStorage.getItem('token');
const dialogueInfo = ref([]);


// 获取今天的日期
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 选中的日期
const selectedDate = ref(getTodayDate());
const availableDays = ref([])
const currentViewMonth = ref(new Date().getMonth() + 1)
const currentViewYear = ref(new Date().getFullYear())
// 获取用户有聊天记录的日期
const fetchAvailableDays = async (year, month) => {
  try {
    const response = await axios.get('http://mxt.nat300.top/dialogue/days/', {
      params: {
        year: year,
        month: month
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.data.code === 0) {
      availableDays.value = response.data.data.days
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

// 处理面板变化（月份或年份改变）
const handlePanelChange = (date) => {
  if (date) {
    // 当日期面板改变时触发，这里可以获取到当前面板所在的年月
    currentViewYear.value = date.getFullYear()
    currentViewMonth.value = date.getMonth() + 1
    fetchAvailableDays(currentViewYear.value, currentViewMonth.value)
  }
}
// 处理日期选择变化
const handleDateChange = (date) => {
  sendRequest();
  console.log('选中的日期:', date);
};
// 禁用日期的函数
// 1. 非本月的日期禁用
// 2. 本月中不在可用日期列表中的日期禁用
const disabledDate = (date) => {
  if (!date) return true
  
  // 判断是否是当前查看的月份
  const isCurrentViewMonth = date.getMonth() + 1 === currentViewMonth.value && date.getFullYear() === currentViewYear.value
  
  // 如果不是当前浏览的月份，直接禁用
  if (!isCurrentViewMonth) {
    return true
  }
  
  // 如果是当前月份，则检查是否在可用日期列表中
  return !availableDays.value.includes(date.getDate())
}

// 设置单元格的Class名称，用于自定义样式
const getCellClassName = (cell) => {
  if (!cell || !cell.date) {
    return ''
  }
  
  const date = cell.date
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  
  // 定义class数组
  const classNames = []
  
  // 判断是否是当前查看的月份
  const isCurrentViewMonth = month === currentViewMonth.value && year === currentViewYear.value
  
  if (!isCurrentViewMonth) {
    // 非当月日期
    classNames.push('other-month-date')
  } else if (availableDays.value.includes(day)) {
    // 当月可用日期
    classNames.push('available-date')
  } else {
    // 当月不可用日期
    classNames.push('unavailable-date')
  }
  
  // 选中的日期
  if (selectedDate.value && 
      day === selectedDate.value.getDate() && 
      month === selectedDate.value.getMonth() + 1 && 
      year === selectedDate.value.getFullYear()) {
    classNames.push('selected-date')
  }
  
  return classNames.join(' ')
}
// 发送请求
const sendRequest = async () => {
  const date = new Date(selectedDate.value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;  
const day = date.getDate();  

  console.log('1=',selectedDate.value, '2=',month, '3=',day);
  try {
    const response = await axios.get('http://mxt.nat300.top/dialogue/diadetail/', {
      params: {
        year: year,
        month: month,
        day: day,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    dialogueInfo.value = response.data.data.dialogue_info;
    console.log(response.data.data.dialogue_info);
    
  } catch (error) {
    console.error('请求失败:', error);
  }
}
onMounted(() => {
  fetchAvailableDays(currentViewYear.value, currentViewMonth.value)
  sendRequest();
})

</script>    

<style scoped>
.history-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.date-picker-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.custom-date-picker {
  width: 240px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.dialogue-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: 564px;
  padding: 10px;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.dialogue-container::-webkit-scrollbar {
  width: 6px;
}

.dialogue-container::-webkit-scrollbar-track {
  background: transparent;
}

.dialogue-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 20px;
}

.empty-state {
  padding: 40px 0;
  opacity: 0.7;
}

.dialogue-item {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
}

.dialogue-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #d0d0d0;
}

.dialogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eaeaea;
}

.model-badge {
  background-color: rgb(42,105,172);
  color: white;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 3px 10px;
  border-radius: 4px;
  display: inline-block;
}

.time-stamp {
  color: #888;
  font-size: 0.85rem;
}

.dialogue-content {
  padding: 0;
}

.question-section, .answer-section {
  padding: 16px 18px;
}

.question-section {
  border-bottom: 1px solid #eaeaea;
}

.label {
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 6px;
  font-weight: 500;
}

.question-text, .answer-text {
  margin: 0;
  line-height: 1.6;
  white-space: pre-wrap;
}

.question-text {
  color: #333;
  font-weight: 500;
}

.answer-text {
  color: #333;
}

/* 列表动画 */
.dialogue-list-enter-active, .dialogue-list-leave-active {
  transition: all 0.3s;
}
.dialogue-list-enter-from, .dialogue-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>