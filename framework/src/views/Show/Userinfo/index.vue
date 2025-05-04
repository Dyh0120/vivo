<template>
  <el-card class="user-info-card" shadow="hover">
    <el-skeleton :loading="loading" animated :rows="8">
      <template #default>
        <div class="user-info-header">
          <el-avatar :src="user.gender=='男'?'./../../../../public/image/男生默认头像.jpg':'./../../../../public/image/女生默认头像.jpg'" :size="90" style="margin:auto"/>
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
            <div class="fonts">{{user.name}}</div>
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
            <div class="fonts">{{user.gender}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Reading />
                </el-icon>
                学号
              </div>
            </template>
            <div class="fonts">{{user.studentId}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Star />
                </el-icon>
                年级
              </div>
            </template>
            <div class="fonts">{{user.grade}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <DataAnalysis />
                </el-icon>
                专业
              </div>
            </template>
            <div class="fonts">{{user.major}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Connection />
                </el-icon>
                班级
              </div>
            </template>
            <div class="fonts">{{user.className}}</div>
          </el-descriptions-item>

          <el-descriptions-item class="items">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Service />
                </el-icon>
                班主任
              </div>
            </template>
            <div class="fonts">{{user.classTeacher}}</div>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-skeleton>
  </el-card>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
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
  DataAnalysis,
  Connection,
  Service
} from '@element-plus/icons-vue'
import axios from 'axios'
// import a from './../../../../public/image'
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
  studentId: '',
  grade: '',
  className: '',
  classTeacher: '',
  major: '',
  avatar: ''
})

const getinfo = async() => {
  try {
    let token = localStorage.getItem('token')
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

    // 一次性更新所有数据，减少多次响应式更新
    user.value = {
      name: data.nickname || '未设置',
      gender: data.sex || '未设置',
      studentId: data.username || '未设置',
      className: data.class || '未设置',
      classTeacher: data.teacher || '未设置',
      grade: data.grade || '未设置',
      major: data.major || '未设置',
      avatar: data.avatar || ''
    }

  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
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
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.cell-item {
  height: 45px;
  font-size: 18.5px;
  line-height: 45px;
  min-width: 100px;
}

.fonts {
  font-size: 17px;
  padding-left: 25px;
}

/* 禁用不必要的过渡动画 */
:deep(.el-descriptions) {
  transition: none;
}

/* 固定描述项宽度 */
:deep(.el-descriptions__body .el-descriptions__table) {
  table-layout: fixed;
}
</style>
