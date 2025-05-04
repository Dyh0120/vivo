<template>
  <el-card class="user-info-card" shadow="hover">
    <el-skeleton :loading="loading" animated :rows="6">
      <template #default>
        <div class="user-info-header">
          <el-avatar src="./../../../../public/image/老师默认头像.jpg" :size="90" style="margin:20px auto"/>
        </div>

        <el-descriptions
          class="margin-top"
          :column="1"
          :size="size"
          border
        >
          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Avatar />
                </el-icon>
                姓名
              </div>
            </template>
            <div class="fonts">{{user.name || '未设置'}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Male />
                </el-icon>
                性别
              </div>
            </template>
            <div class="fonts">{{user.gender || '未设置'}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Reading />
                </el-icon>
                工号
              </div>
            </template>
            <div class="fonts">{{user.teacherId || '未设置'}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Star />
                </el-icon>
                管理年级
              </div>
            </template>
            <div class="fonts">{{user.teachergrade || '未设置'}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Connection />
                </el-icon>
                管理班级
              </div>
            </template>
            <div class="fonts">{{user.teacherclassName || '未设置'}}</div>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-skeleton>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ElCard,
  ElAvatar,
  ElSkeleton,
  ElDescriptions,
  ElDescriptionsItem,
  ElIcon,
  ElMessage
} from 'element-plus'
import {
  Avatar,
  Male,
  Reading,
  Star,
  Connection
} from '@element-plus/icons-vue'
import axios from 'axios'

const loading = ref(true)
const size = ref('default')
const iconStyle = computed(() => {
  return {
    fontSize: '18px',
    marginRight: '8px',
    verticalAlign: 'middle'
  }
})

// 初始化空数据
const user = ref({
  name: '',
  gender: '',
  teacherId: '',
  teachergrade: '',
  teacherclassName: '',
  avatar: ''
})

const getinfo = async() => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.warning('请先登录')
      return
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }

    const response = await axios.get('http://mxt.nat300.top/user/info/', config)
    const data = response.data.data.user

    // 一次性更新所有数据
    user.value = {
      name: data.nickname || '',
      gender: data.sex || '',
      teacherId: data.username || '',
      teacherclassName: data.class || '',
      teachergrade: data.grade || '',
      avatar: data.avatar || ''
    }

  } catch (error) {
    console.error('获取教师信息失败:', error)
    ElMessage.error('获取教师信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getinfo()
})
</script>

<style scoped>
.user-info-card {
  width: 850px;
  height: 600px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.cell-item {
  height: 50px;
  font-size: 18.5px;
  line-height: 45px;
  min-width: 120px;
}

.fonts {
  font-size: 17px;
  padding-left: 25px;
  min-height: 20px;
}

/* 固定表格布局 */
:deep(.el-descriptions__body .el-descriptions__table) {
  table-layout: fixed;
  width: 100%;
}

/* 禁用内部元素过渡动画 */
:deep(.el-descriptions__body),
:deep(.el-descriptions-item__cell) {
  transition: none;
}
</style>
