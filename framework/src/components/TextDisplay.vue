<template>
  <div class="text-display">
    <el-card :body-style="{ height: '290px' }" class="card-container">
      <h2 style="color:#409eff; margin-bottom:10px">相关数据点展示</h2>
      <div class="text-section">
        <sapn class="title">主要情感标签</sapn>
        <sapn>{{ text1 }}</sapn>
      </div>

      <div class="text-section">
        <sapn class="title">自然语言描述</sapn>
        <sapn>{{ currentDetail }}</sapn>
      </div>

  <div class="text-section">
    <span class="title">情感反馈或建议</span>
  <el-tooltip
    effect="dark"
    :content="currentSuggestion"
    placement="top-start"
    :disabled="!isOverflowed"
    popper-class="custom-tooltip"
  >
    <div class="truncated-text" ref="textElement">
      {{ currentSuggestion }}
    </div>
  </el-tooltip>
  </div>

      <!-- 分页组件 -->
      <div class="pagination-wrapper" >
        <el-pagination

          layout="prev, pager, next"
          :total="statusList.length"
          :page-size="1"
          :current-page="currentPage"
          :pager-count="2"
          @current-change="handlePageChange"

        />
        <!-- <span class="page-info">第 {{ currentPage }} 条</span> -->
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { ElCard,ElTooltip  } from 'element-plus';
import axios from 'axios';

const text1 = ref('请点击图表中的数据点查看详情');
const text2 = ref('等待数据点选择...');
const text3 = ref('等待数据点选择...');
const textElement = ref(null);
const shouldTruncate = ref(false);
const isOverflowed = ref(false);
const statusList = ref([]);
const currentPage = ref(1);
const currentDetail = ref('等待数据点选择');
const currentSuggestion = ref('等待数据点选择');


onMounted(async () => {
  checkOverflow();
});

const checkOverflow = () => {
  if (textElement.value) {
    isOverflowed.value = textElement.value.scrollHeight > textElement.value.clientHeight;
  }
};
// 更新当前显示的内容
const updateCurrentContent = (index) => {
    currentPage.value = index + 1;
      if (statusList.value[index]) {

    currentDetail.value = statusList.value[index].detail || '暂无描述';
    currentSuggestion.value = statusList.value[index].suggestion || '暂无建议';
  } else {

  }
  nextTick(checkOverflow);
  }

// 处理分页变化
const handlePageChange = (page) => {
  // console.log('切换至页码:', page, '数据:', statusList.value[page - 1]);
  updateCurrentContent(page - 1); // 转为0-based索引
};

// 暴露方法供父组件调用
const updateTexts =async (xIndex, yIndex) => {
  try {
    let token = localStorage.getItem('token');
    // console.log('Token:', token); // 调试信息
    if (!token) {
       console.log('无token');
    }
    const config = {

        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
   const response = await axios.get('http://mxt.nat300.top/status/detail/', {
  ...config,
  params: {
    date: xIndex,
    label_id: yIndex
  }
});
console.log(statusList.value);
    if(statusList.value==''){
      currentDetail.value = '暂无描述';
    currentSuggestion.value = '暂无建议';
    // currentPage.value=0
    }
    statusList.value = response.data.data.status_list;
    text1.value = getEmotionName(yIndex);

    if (statusList.value.length > 0) {
      currentPage.value = 1;

      updateCurrentContent(0);
    }

  } catch (error) {
    // ElMessage.error('获取信息失败')
  }

};

const getEmotionName = (yIndex) => {
  const emotions = ['悲伤', '焦虑', '平静', '愉悦', '欣喜'];
  return emotions[yIndex] || '未知情绪';
};

defineExpose({ updateTexts });
</script>

<style scoped>
::v-deep(.custom-tooltip) {
  max-width: 400px !important;
  white-space: normal;
  word-break: break-word;
}
/* 或者如果使用 scoped 样式，需要深度选择器 */
.card-container {
  display: flex;
  flex-direction: column;
  height: 290px; /* 保持原有高度 */
}
.pagination-wrapper {
  margin-top: auto; /* 将分页器推到底部 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  width: 100%;
}
.text-section {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
}

.title {
  color: #5da2e7;
  font-size: 20px;
  font-weight: 550;
  margin-right: 20px;
  flex-shrink: 0;
}

.content-wrapper {
  flex: 1;
  min-width: 0; /* 确保flex布局下文本截断生效 */
}

.truncated-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  color: #606266;
  line-height: 1.5;
  cursor: pointer;
}

/* 可选：添加悬浮效果 */
.truncated-text:hover {
  cursor: pointer;
  background-color: #f5f7fa;
}
.text-display {
  width: 900px;
  margin: 10px;
  margin-left: 45px;
  height: 300px;
}

.text-section {
  margin-bottom: 20px;
}

.title {
  color: #5da2e7;
  font-size: 20px;
  font-weight: 550;
  margin-right: 20px;
}

sapn {
  color: #606266;
}
</style>
