<template>
  <div class="student-management">
    <!-- 搜索框 -->
    <el-select
      v-model="value"
      placeholder="全部"
      size="large"
      style="width: 150px;margin-right:20px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-input
      v-model="searchQuery"
      placeholder="搜索学生"
      size="large"
      class="search-input"
      style="width: 790px"
    >
      <template #append>
        <el-button :icon="Search" @click="handleSearch" />
      </template>
    </el-input>

    <!-- 学生档案列表 -->
    <el-table :data="paginatedStudents" style="width: 100%;margin-top:20px">
      <el-table-column prop="nickname" label="姓名"/>
      <el-table-column prop="username" label="学号" />
      <el-table-column prop="grade" label="年级" />
      <el-table-column prop="emotion_score" label="情感评分" />
      <el-table-column label="操作" >
        <template #default="scope">
          <el-button
            text
            type="primary"
            class="table-btn ml10"
            @click="detail(scope.$index, scope.row.username)"
            style="margin-left:-12px;"
            :loading="loadingDetails[scope.row.username] || false"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 学生详情弹窗 -->
    <el-dialog
      v-model="centerDialogVisible"
      title="学生情感详情"
      width="820px"
      :modal="true"
      :lock-scroll="true"
      :close-on-click-modal="false"
      class="student-detail-dialog"
    >
      <el-descriptions border>
        <el-descriptions-item label="姓名">{{ nickname }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{ username }}</el-descriptions-item>
        <el-descriptions-item label="年级">{{ grade }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ sex }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ birthday }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ classname }}</el-descriptions-item>
        <el-descriptions-item label="宿舍">{{ dormitory }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ phone }}</el-descriptions-item>
        <el-descriptions-item label="情感评分">
          <el-tag size="small">{{ emotion_score }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
      layout="prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import axios from 'axios';

const centerDialogVisible = ref(false);
const value = ref('');
const loadingDetails = ref({}); // 改为对象形式，以学号为key存储加载状态

const options = [
  { value: '0', label: '全部' },
  { value: '1', label: '按学号搜索' },
  { value: '2', label: '按姓名搜索' },
  { value: '3', label: '按年级搜索' },
  { value: '4', label: '重点关注' },
];

// 所有学生数据
const allStudents = ref([]);
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return allStudents.value.slice(start, end);
});

// 搜索和分页相关
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 学生详情数据
const nickname = ref('');
const username = ref('');
const sex = ref('');
const birthday = ref('');
const classname = ref('');
const dormitory = ref('');
const emotion_score = ref('');
const teacher = ref('');
const grade = ref('');
const phone = ref('');

// 方法定义
const handleSearch = () => {
  currentPage.value = 1;
  getinfo(searchQuery.value, value.value);
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const detail = async (index, studentUsername) => {
  // 设置当前学生的加载状态为true
  loadingDetails.value = {
    ...loadingDetails.value,
    [studentUsername]: true
  };

  try {
    const realIndex = (currentPage.value - 1) * pageSize.value + index;
    await datailinfo(allStudents.value[realIndex].username);
    centerDialogVisible.value = true;
  } catch (error) {
    console.error('加载详情失败:', error);
  } finally {
    // 请求完成后，无论成功失败，都取消加载状态
    loadingDetails.value = {
      ...loadingDetails.value,
      [studentUsername]: false
    };
  }
};

const datailinfo = async (username2) => {
  try {
    const config = {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { student_id: username2 }
    };
    const response = await axios.get(`http://mxt.nat300.top/teacher/detail/`, config);
    const data = response.data.data;
    nickname.value = data.nickname;
    username.value = data.username;
    sex.value = data.sex;
    birthday.value = data.birthday;
    classname.value = data.class;
    dormitory.value = data.dormitory;
    teacher.value = data.teacher;
    grade.value = data.grade;
    phone.value = data.phone;
    emotion_score.value = data.emotion_score;
  } catch (error) {
    console.error('获取详情失败:', error);
    throw error;
  }
};

const getinfo = async (goal, value) => {
  try {
    let student_id = -1, name = '', grade = -1,important=0;
    if (value == 1) student_id = goal;
    else if (value == 2) name = goal;
    else if (value == 3) grade = goal;
    else if(value==4) important=1
    const config = {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { student_id, name, grade,important }
    };

    const response = await axios.get('http://mxt.nat300.top/teacher/stu/', config);

    if (response.data.code == 0) {
      allStudents.value = response.data.data.student_list;
      total.value = response.data.data.total;
      currentPage.value = 1;
    }
  } catch (error) {
    console.error('获取学生列表失败:', error);
  }
};

// 初始化
const token = localStorage.getItem('token');
onMounted(() => getinfo());

watch(value, (newVal) => getinfo('', newVal));
</script>

<style scoped>
.student-management {
  padding: 20px;
  position: relative;
  height: 650px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
  position: absolute;
  bottom: 0;
  right: 500px;
}

.student-detail-dialog {
  transition: none !important;
}

.student-detail-dialog .el-dialog {
  margin-top: 15vh !important;
}
</style>
