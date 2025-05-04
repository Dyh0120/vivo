<template>
  <div class="student-management">
    <!-- 搜索栏 -->
    <el-select
      v-model="searchType"
      placeholder="筛选条件"
      size="large"
      style="width: 150px; margin-right: 20px"
      @change="handleSearchTypeChange"
    >
      <el-option label="全部" value="all" />
      <el-option label="按账号搜索" value="username" />
      <el-option label="按姓名搜索" value="nickname" />
      <el-option label="按学院搜索" value="college_id" />
      <el-option label="按专业搜索" value="major_id" />
      <el-option label="按班级搜索" value="class_id" />
      <el-option label="按民族搜索" value="nationality_id" />
      <el-option label="按身份搜索" value="role" />
    </el-select>

    <!-- 动态搜索组件 -->
    <template v-if="searchType === 'all'">
      <el-input
        placeholder="请选择筛选条件"
        size="large"
        style="width: 790px"
        disabled
      />
    </template>
    <template v-else-if="['username', 'nickname'].includes(searchType)">
      <el-input
        v-model="searchQuery"
        placeholder="请输入搜索内容"
        size="large"
        class="search-input"
        style="width: 790px"
      >
        <template #append>
          <el-button :icon="Search" @click="handleSearch" />
        </template>
      </el-input>
    </template>
    <template v-else>
      <el-select
        v-model="searchQuery"
        placeholder="请选择"
        size="large"
        style="width: 790px"
        @change="handleSearch"
        clearable
      >
        <el-option
          v-for="item in optionsList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </template>

    <!-- 学生档案表格 -->
    <el-table :data="paginatedStudents" style="width: 100%; margin-top: 20px">
      <el-table-column prop="nickname" label="姓名" />
      <el-table-column prop="username" label="账号" />
      <el-table-column prop="class" label="班级" />
      <el-table-column prop="college" label="学院" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button text style="margin-left: -13px;" type="primary" @click="viewDetails(scope.row)">
            查看详情
          </el-button>
          <el-button
            text
            type="danger"
            class="table-btn ml10"
            @click="confirmDelete(scope.row.id)"
            :loading="loadingDelete[scope.row.id] || false"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
      layout="prev, pager, next"
    />

    <!-- 查看详情弹窗 -->
    <el-dialog
      title="学生详情"
      v-model="detailDialogVisible"
      width="600px"
      :before-close="() => (detailDialogVisible = false)"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="账号">{{ detailUser.username }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ detailUser.nickname }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ detailUser.sex }}</el-descriptions-item>
        <el-descriptions-item label="年级">{{ detailUser.grade }}</el-descriptions-item>
        <el-descriptions-item label="学院">{{ detailUser.college }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ detailUser.major }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ detailUser.class }}</el-descriptions-item>
        <el-descriptions-item label="民族">{{ detailUser.nationality }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ detailUser.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detailUser.email }}</el-descriptions-item>
        <el-descriptions-item label="宿舍">{{ detailUser.dormitory }} {{ detailUser.room }}</el-descriptions-item>
        <el-descriptions-item label="籍贯">{{ detailUser.home_place }}</el-descriptions-item>
        <el-descriptions-item label="辅导员">{{ detailUser.teacher }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

const searchType = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const allStudents = ref([]);
const loadingDelete = ref({});
const optionsList = ref([]); // 存储下拉选项
const roleOptions = ref([
  { id: 'user', name: '学生' },
  { id: 'teacher', name: '老师' },
  { id: 'admin', name: '管理员' }
]);

const token = localStorage.getItem('token');

// 弹窗状态与详情数据
const detailDialogVisible = ref(false);
const detailUser = ref({});

const paginatedStudents = computed(() => {
  return allStudents.value;
});

// 获取选项列表
const fetchOptions = async (type) => {
  try {
    let url = '';
    switch (type) {
      case 'class_id':
        url = 'http://mxt.nat300.top/search/class/';
        break;
      case 'major_id':
        url = 'http://mxt.nat300.top/search/major/';
        break;
      case 'college_id':
        url = 'http://mxt.nat300.top/search/college/';
        break;
      case 'nationality_id':
        url = 'http://mxt.nat300.top/search/nationality/';
        break;
      default:
        return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const response = await axios.get(url, config);
    if (response.data.code === 0) {
      if (type === 'class_id') {
        optionsList.value = response.data.data.class_list.map(item => ({
          id: item.class_id,
          name: item.class_name
        }));
      } else if (type === 'major_id') {
        optionsList.value = response.data.data.major_list.map(item => ({
          id: item.major_id,
          name: item.major_name
        }));
      } else if (type === 'college_id') {
        optionsList.value = response.data.data.college_list.map(item => ({
          id: item.college_id,
          name: item.college_name
        }));
      } else if (type === 'nationality_id') {
        optionsList.value = response.data.data.nationality_list.map(item => ({
          id: item.nationality_id,
          name: item.nationality_name
        }));
      }
    }
  } catch (error) {
    console.error('获取选项列表失败:', error);
    ElMessage.error('获取选项列表失败');
  }
};

// 处理搜索类型变化
const handleSearchTypeChange = (type) => {
  searchQuery.value = ''; // 清空搜索内容
  if (type === 'role') {
    optionsList.value = roleOptions.value;
  } else if(type === 'all') getinfo()
  else if (['class_id', 'major_id', 'college_id', 'nationality_id'].includes(type)) {
    fetchOptions(type);
  }
};

// 获取学生信息
const getinfo = async () => {
  try {
    let params = {
      page: currentPage.value,
      size: pageSize.value,
      college_id: -1,
      major_id: -1,
      nationality_id: -1,
      class_id: -1,
      username: '',
      nickname: '',
      role: ''
    };

    // 处理搜索条件
    if (searchType.value !== 'all') {
      if (searchQuery.value) {
        // 处理ID类型的搜索条件
        if (searchType.value.endsWith('_id')) {
          params[searchType.value] = parseInt(searchQuery.value);
        } else if (searchType.value === 'role') {
          params[searchType.value] = searchQuery.value;
        } else {
          // 处理文本类型的搜索条件
          params[searchType.value] = searchQuery.value.trim();
        }
      }
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params
    };

    const response = await axios.get('http://mxt.nat300.top/adm/all/', config);
    if (response.data.code === 0) {
      allStudents.value = response.data.data.list;
      total.value = response.data.data.total;
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error('获取用户列表失败');
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  getinfo();
};

const handlePageChange = (page) => {
  currentPage.value = page;
  getinfo();
};

const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该学生信息吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    handleDelete(id);
  } catch (err) {
    // 用户取消了删除
  }
};

// 删除用户
const handleDelete = async (id) => {
  loadingDelete.value = { ...loadingDelete.value, [id]: true };
  try {
    await axios.delete(
      'http://mxt.nat300.top/adm/deluser/',
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { id }
      }
    );
    ElMessage.success('删除成功');
    getinfo();
  } catch (error) {
    ElMessage.error('删除失败');
    console.error('删除失败:', error);
  } finally {
    loadingDelete.value = { ...loadingDelete.value, [id]: false };
  }
};

const viewDetails = async (user) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        student_id: user.username
      }
    };

    const res = await axios.get('http://mxt.nat300.top/teacher/detail/', config);
    if (res.data.code === 0) {
      detailUser.value = res.data.data;
      detailDialogVisible.value = true;
    } else {
      ElMessage.error('获取学生详情失败');
    }
  } catch (error) {
    console.error('获取学生详情失败:', error);
    ElMessage.error('请求出错，无法获取详情');
  }
};

onMounted(() => {
  getinfo();
});
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
</style>
