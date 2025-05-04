<template>
  <div style="position: relative; width: 100%; height: 600px;">
    <div ref="chartContainer" style="width: 100%; height: 100%;"></div>
    <el-button 
      class="export-button" 
      type="primary" 
      size="middle" 
      @click="exportmd">
      导出报告
    </el-button>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus' // Add this import
import { Download } from '@element-plus/icons-vue'

const chartContainer = ref(null);
const chartInstance = ref(null);

const fetchData = async () => {
  let token = localStorage.getItem('token');
  if (!token) {
    ElMessage.warning('请先登录');
    return;
  }

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  try {
    const response = await axios.get('http://mxt.nat300.top/teacher/round/', config);
    if (response.data.code === 0) {
      renderChart(response.data.data.score_dict);
    } else {
      ElMessage.error(response.data.message || '获取数据失败');
    }
  } catch (error) {
    console.error('请求失败:', error);
    ElMessage.error('请求数据失败');
  }
};

const renderChart = (scoreData) => {
  if (!chartInstance.value) return;

  const pieData = Object.entries(scoreData).map(([name, value]) => ({
    name,
    value: (value * 100).toFixed(2)
  }));

  const option = {
    title: {
      text: '学生情感评分分布',
      left: '50%',
      top: '95%',
      textAlign: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    legend: {
      orient: 'vertical',
      top: '90%',
      left: '5%',
      data: Object.keys(scoreData)
    },
    series: [
      {
        name: '评分分布',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: pieData
      }
    ]
  };

  chartInstance.value.setOption(option);
};

const exportmd = (() => {
  const throttleTime = 3000;
  let lastCall = 0;
  
  return async () => {
    const now = Date.now();
    if (now - lastCall < throttleTime) {
      ElMessage.warning('请勿频繁操作，请稍后再试！');
      return;
    }
    lastCall = now;
    
    const token = localStorage.getItem('token');
    const loading = ElLoading.service({ 
      fullscreen: false, 
      target: '.show', 
      text: '导出中...' 
    });

    try {
      const response = await axios.post('http://mxt.nat300.top/teacher/report/', {}, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/markdown;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '班级情感监测分析报告.md';
      link.click();
      window.URL.revokeObjectURL(url);
      ElMessage.success('导出成功！');

    } catch (error) {
      console.error('导出失败', error);
      ElMessage.error('导出失败，请稍后再试！');
    } finally {
      loading.close();
    }
  };
})();

onMounted(() => {
  chartInstance.value = echarts.init(chartContainer.value);
  fetchData();
  window.addEventListener('resize', () => {
    chartInstance.value?.resize();
  });
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
  }
  window.removeEventListener('resize', () => {
    chartInstance.value?.resize();
  });
});
</script>

<style scoped>
.export-button {
  position: absolute;
  bottom: 0px;
  right: 7%;
}
</style>
