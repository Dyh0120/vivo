<template>
  <div class="card-list-container">
    <!-- 顶部标题和发送按钮 -->
    <div class="header">
      <div class="title-container">
        <h1 class="title">重点关注对象</h1>
      </div>
      <div class="button-container">
        <el-tooltip content="发送心理健康筛查辅助量表" placement="top">
          <el-button 
            type="primary" 
            :icon="Comment"
            :loading="sendingScreenings"
            :disabled="students.length === 0 || sendingScreenings" 
            @click="sendScreeningForms"
            class="screening-button"
          >
            发送量表
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 如果没有数据则显示提示 -->
    <el-empty
      v-if="students.length === 0 && !loading"
      description="暂无重点关注对象"
      :image-size="200"
    />
    <!-- 如果数据正在加载中，显示加载状态 -->
    <el-empty
      v-if="loading"
      description="加载中..."
      :image-size="200"
    />

    <!-- 卡片列表 -->
    <div class="card-list">
      <el-card
        v-for="student in paginatedStudents"
        :key="student.id"
        class="card-item"
        shadow="hover"
        @click="handleCardClick(student)"
      >
        <div class="card-content">
          <p><strong>姓名:</strong> {{ student.nickname }}</p>
          <p><strong>性别:</strong> {{ student.sex === '未设置' ? '未设置' : student.sex }}</p>
          <p><strong>年级:</strong> {{ student.grade }}</p>
          <p><strong>情绪评分:</strong> {{ student.emotion_score }}</p>
        </div>
      </el-card>
    </div>

    <!-- 分页器 -->
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="students.length"
      @current-change="handlePageChange"
      layout="prev, pager, next"
    />

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`${selectedStudent?.nickname} - 情绪变化趋势`"
      width="800px"
    >
      <div v-if="chartLoading" class="loading">加载中...</div>
      <div v-else-if="chartError" class="error">加载失败: {{ chartError }}</div>
      <div v-else ref="chartContainer" style="width: 100%; height: 400px;"></div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { Comment } from '@element-plus/icons-vue';

// 学生数据相关
const students = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const pageSize = ref(6);
const sendingScreenings = ref(false);

// 弹窗和图表相关
const dialogVisible = ref(false);
const chartLoading = ref(false);
const chartError = ref(null);
const selectedStudent = ref(null);
const chartContainer = ref(null);
let chartInstance = null;

// 情绪状态颜色映射
const emotionColors = {
  '悲伤': '#6495ED',
  '焦虑': '#FF6347',
  '平静': '#32CD32',
  '愉悦': '#FFD700',
  '欣喜': '#DA70D6'
};

const token = localStorage.getItem('token');

// 获取学生数据
const fetchStudents = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://mxt.nat300.top/teacher/stu/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        important: 1,
      }
    });
    students.value = response.data.data.student_list || [];
  } catch (error) {
    console.error('获取学生数据失败', error);
    students.value = [];
    ElMessage.error('获取学生数据失败');
  } finally {
    loading.value = false;
    handlePageChange(1);
  }
};

// 发送心理健康筛查量表
const sendScreeningForms = async () => {
  if (students.value.length === 0) {
    ElMessage.warning('没有重点关注对象可发送');
    return;
  }

  sendingScreenings.value = true;
  
  try {
    // 获取所有学生的user_id并发送
    const promises = students.value.map(student => {
      return axios.post('http://mxt.nat300.top/teacher/todo/', 
        { user_id: student.id }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
    });
    
    await Promise.all(promises);
    ElMessage.success(`已向${students.value.length}位学生发送心理健康筛查量表`);
  } catch (error) {
    console.error('发送心理健康筛查量表失败', error);
    ElMessage.error('发送心理健康筛查量表失败');
  } finally {
    sendingScreenings.value = false;
  }
};

// 获取情绪数据
const fetchEmotionData = async (studentId) => {
  chartLoading.value = true;
  chartError.value = null;

  try {
    const response = await axios.get('http://mxt.nat300.top/teacher/stuemotion/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        student_id: studentId
      }
    });
    console.log(response.data);

    if (response.data.code !== 0) {
      throw new Error(response.data.message || '获取情绪数据失败');
    }

    return response.data.data;
  } catch (error) {
    chartError.value = error.message || '获取情绪数据失败';
    console.error('获取情绪数据失败:', error);
    return null;
  } finally {
    chartLoading.value = false;
  }
};

// 初始化图表
const initChart = (emotionData) => {
  if (!chartContainer.value) return;

  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose();
  }

  chartInstance = echarts.init(chartContainer.value);

  // 准备系列数据
  const series = emotionData.y_s.map((emotion, emotionIndex) => ({
    name: emotion,
    type: 'line',
    data: emotionData.data.map(item => item[emotionIndex]),
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      width: 3
    },
    itemStyle: {
      color: emotionColors[emotion] || '#888'
    },
    emphasis: {
      itemStyle: {
        borderColor: '#000',
        borderWidth: 2
      }
    }
  }));

  // 处理x轴数据，只显示月日
  const formatMonthDay = (dateStr) => {
    const parts = dateStr.split('-');
    return `${parts[1]}-${parts[2]}`;
  };

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: params => {
        const date = emotionData.x_s[params.dataIndex];
        const emotion = params.seriesName;
        const value = params.value;
        return `时间: ${date}<br/>情绪: ${emotion}<br/>值: ${value.toFixed(2)}`;
      },
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      },
      extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);'
    },
    legend: {
      data: emotionData.y_s,
      top: 0
    },
    grid: {
      top: 40,
      right: 30,
      bottom: 50,
      left: 50
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: emotionData.x_s.map(date => formatMonthDay(date)),
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      max: 1,
      min: 0
    },
    series
  };

  chartInstance.setOption(option);
  window.addEventListener('resize', resizeChart);
};

// 调整图表大小
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 处理卡片点击
const handleCardClick = async (student) => {
  selectedStudent.value = student;
  dialogVisible.value = true;

  const emotionData = await fetchEmotionData(student.username);
  if (emotionData) {
    await nextTick();
    initChart(emotionData);
  }
};

// 分页处理
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return students.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

// 生命周期钩子
onMounted(() => {
  fetchStudents();
});

onBeforeUnmount(() => {
  if (chartInstance) {
    window.removeEventListener('resize', resizeChart);
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
.card-list-container {
  position: relative;
  padding: 32px 24px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 650px;
  background-color: #f9f9fc;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
}

.title-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.button-container {
  position: absolute;
  right: 0;
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-bottom: 12px;
  margin: 0;
}

.title:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #4b7bec, #3867d6);
  border-radius: 3px;
}

.screening-button {
  margin-left: 15px;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card-item {
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.card-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 20px;
  background: white;
}

.card-content p {
  margin: 12px 0;
  color: #555;
  font-size: 15px;
  line-height: 1.5;
}

.card-content p strong {
  color: #333;
  font-weight: 600;
  min-width: 60px;
  display: inline-block;
}

.el-empty {
  margin: 60px auto;
  width: 100%;
}

.pagination {
  margin-top: 20px;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: #666;
  font-size: 16px;
}

.error {
  color: #f56c6c;
}

.el-button {
  margin-left: 0;
}
</style>