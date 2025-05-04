<template>
  <div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">加载失败: {{ error }}</div>
    <div v-else ref="chartContainer" style="width: 100%; height: 350px;"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

const props = defineProps({
  onNodeClick: {
    type: Function,
    default: (xIndex, yIndex) => {}
  }
});
const emit = defineEmits(['node-click']);
const chartContainer = ref(null);
const chartInstance = ref(null);
const loading = ref(true);
const error = ref(null);

// 颜色映射
const emotionColors = ['#6c7a89', '#355C7D', '#7BC8A4', '#ffd700', '#ffa500'];

const fetchEmotionData = async () => {
  try {
    loading.value = true;
    error.value = null;

    const token = localStorage.getItem('token');
    if (!token) throw new Error('未找到用户令牌');

    const response = await axios.get('http://mxt.nat300.top/status/emotion/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.data.code !== 0) {
      throw new Error(response.data.message || '获取情绪数据失败');
    }

    return response.data.data;
  } catch (err) {
    error.value = err.message;
    console.error('获取情绪数据失败:', err);
    return null;
  } finally {
    loading.value = false;
  }
};

const initChart = (emotionData) => {
  if (!chartContainer.value || !emotionData?.data?.length) return;

  if (chartInstance.value) {
    chartInstance.value.dispose();
  }

  chartInstance.value = echarts.init(chartContainer.value);

  // 转置 data：data[x][y] -> rawData[y][x]
  const rawData = emotionData.y_s.map((_, yIdx) =>
    emotionData.data.map(row => row[yIdx])
  );

  // 计算每个日期下的总和
  const totalData = [];
  for (let i = 0; i < rawData[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData.length; ++j) {
      sum += rawData[j][i];
    }
    totalData.push(sum);
  }

  const grid = {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50
  };

  const gridWidth = chartInstance.value.getWidth() - grid.left - grid.right;
  const gridHeight = chartInstance.value.getHeight() - grid.top - grid.bottom;
  const categoryWidth = gridWidth / rawData[0].length;
  const barWidth = categoryWidth * 0.6;
  const barPadding = (categoryWidth - barWidth) / 2;

  const series = emotionData.y_s.map((name, sid) => ({
    name,
    type: 'bar',
    stack: 'total',
    barWidth: '60%',
    label: {
      show: true,
      formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
    },
    itemStyle: {
      color: emotionColors[sid]
    },
    data: rawData[sid].map((d, did) =>
      totalData[did] <= 0 ? 0 : d / totalData[did]
    )
  }));

  const elements = [];
  for (let j = 1, jlen = rawData[0].length; j < jlen; ++j) {
    const leftX = grid.left + categoryWidth * j - barPadding;
    const rightX = leftX + barPadding * 2;
    let leftY = grid.top + gridHeight;
    let rightY = leftY;
    for (let i = 0; i < series.length; ++i) {
      const points = [];
      const leftBarHeight = (rawData[i][j - 1] / totalData[j - 1]) * gridHeight;
      points.push([leftX, leftY]);
      points.push([leftX, leftY - leftBarHeight]);
      const rightBarHeight = (rawData[i][j] / totalData[j]) * gridHeight;
      points.push([rightX, rightY - rightBarHeight]);
      points.push([rightX, rightY]);
      points.push([leftX, leftY]);
      leftY -= leftBarHeight;
      rightY -= rightBarHeight;
      elements.push({
        type: 'polygon',
        shape: {
          points
        },
        style: {
          fill: emotionColors[i],
          opacity: 0.25
        }
      });
    }
  }

  const option = {
    legend: {
      selectedMode: false
    },
    tooltip: {
      trigger: 'item',
      formatter: params => {
        const date = emotionData.x_s[params.dataIndex];
        const emotion = params.seriesName;
        const value = params.value;
        return `时间: ${date}<br/>情绪: ${emotion}<br/>占比: ${(value * 100).toFixed(1)}%`;
      }
    },
    grid,
    xAxis: {
      type: 'category',
      data: emotionData.x_s.map(d => d.slice(5)) // 只显示 MM-DD
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1
    },
    series,
    graphic: {
      elements
    }
  };

  chartInstance.value.setOption(option);

  chartInstance.value.on('click', (params) => {
    if (params.componentType === 'series') {
      const xIndex = emotionData.x_s[params.dataIndex];
      const yIndex = emotionData.y_s.indexOf(params.seriesName);
      emit('node-click', { xIndex, yIndex });
    }
  });
};

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

onMounted(async () => {
  const emotionData = await fetchEmotionData();
  if (emotionData) {
    initChart(emotionData);
    window.addEventListener('resize', resizeChart);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
  if (chartInstance.value) {
    chartInstance.value.off('click');
    chartInstance.value.dispose();
  }
});
</script>

<style scoped>
.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
  color: #666;
  font-size: 16px;
}

.error {
  color: #f56c6c;
}
</style>
