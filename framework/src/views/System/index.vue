<template>
<div class="contain">
  <div class="tips" v-if="showTip">{{ tipText }}<br>
    <el-button type="danger" plain @click="xiao">拒绝填写</el-button>
  </div>
  <div class="w">
    <Top/>
    <div class="nav">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false" size="large" style="margin-left: 10px;">详情</el-radio-button>
        <el-radio-button :value="true" size="large">折叠</el-radio-button>
      </el-radio-group>
      <el-menu
        :default-active="defaultindex"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
      >
        <el-menu-item :index="1" class="elitem" v-if="role=='user'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><ChatDotRound /></el-icon>
          <template #title>实时分析</template>
        </el-menu-item>
        <el-menu-item :index="2" class="elitem" v-if="role=='user'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><DataLine /></el-icon>
          <template #title>情感轨迹</template>
        </el-menu-item>
        <el-menu-item :index="3" class="elitem" v-if="role=='user'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><FolderOpened /></el-icon>
          <template #title>使用记录</template>
        </el-menu-item>
        <el-menu-item :index="12" class="elitem" v-if="role=='user'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><EditPen /></el-icon>
          <template #title>PHQ-9</template>
        </el-menu-item>
        <el-menu-item :index="13" class="elitem" v-if="role=='user'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><EditPen /></el-icon>
          <template #title>GAD-7</template>
        </el-menu-item>
        <el-menu-item :index="4" class="elitem" v-if="role=='user'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><User /></el-icon>
          <template #title>个人信息</template>
        </el-menu-item>
        <el-menu-item :index="6" class="elitem" v-if="role=='teacher'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><FolderOpened /></el-icon>
          <template #title>学生档案</template>
        </el-menu-item>
        <el-menu-item :index="7" class="elitem" v-if="role=='teacher'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><Aim /></el-icon>
          <template #title>重点关注</template>
        </el-menu-item>
        <el-menu-item :index="8" class="elitem" v-if="role=='teacher'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><PieChart /></el-icon>
          <template #title>统计情况</template>
        </el-menu-item>
        <el-menu-item :index="9" class="elitem" v-if="role=='teacher'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><User /></el-icon>
          <template #title>个人信息</template>
        </el-menu-item>
        <el-menu-item :index="10" class="elitem" v-if="role=='admin'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><User /></el-icon>
          <template #title>全部用户</template>
        </el-menu-item>
        <el-menu-item :index="11" class="elitem" v-if="role=='admin'" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><CirclePlus /></el-icon>
          <template #title>添加用户</template>
        </el-menu-item>
        <el-menu-item :index="14" class="elitem" v-if="role" style="font-size: 17px;letter-spacing: 0.1em;" >
          <el-icon :size="38"><SwitchButton /></el-icon>
          <template #title>退出登录</template>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="show">
      <router-view/>
    </div>
    <div class="footer">
      <p>冀ICP备2025107604号</p>
    </div>

    <!-- 退出对话框 -->
    <el-dialog v-model="centerDialogVisible" title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;确认退出吗？" width="370" center align-center class="custom-dialog">
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false" style="margin-left:15px;padding:19px;font-size:16px">取消</el-button>
          <el-button type="primary" @click="handleLogout()" style="padding:19px;font-size:16px;margin-left:20px;">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</div>
</template>

<script lang="ts" setup>
import { DataLine, ChatDotRound, FolderOpened, User, TurnOff, Aim, PieChart, SwitchButton, CirclePlus, EditPen } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import Top from '@/components/Top/index.vue'
import { useRoute, useRouter } from 'vue-router'
import emitter from '@/utils/eventBus.js'

const router = useRouter()
const role = localStorage.getItem('role')
const isCollapse = ref(false)
const centerDialogVisible = ref(false)
const indexx = ref('1')
const showTip = ref(false)
const tipText = ref('同学你好，请尽快完成PHQ-9和GAD-7两个量表')

const defaultindex = ref('1')
if (role == 'user') defaultindex.value = '1'
else if (role == 'teacher') defaultindex.value = '6'
else if (role == 'admin') defaultindex.value = '10'

const xiao = () => {
  showTip.value = false
}

const handleSelect = (index: any) => {
  indexx.value = index
}
const handleOpen = (key: string, keyPath: string[]) => {
  indexx.value = key
}
const handleClose = (key: string, keyPath: string[]) => {
  indexx.value = key
}

watch(indexx, (newValue) => {
  if (newValue == '1') router.push({ path: '/system/analysis' })
  if (newValue == '2') router.push({ path: '/system/linechart' })
  if (newValue == '3') router.push({ path: '/system/record' })
  if (newValue == '4') router.push({ path: '/system/userinfo' })
  if (newValue == '6') router.push({ path: '/system/teacherSearchFile' })
  if (newValue == '7') router.push({ path: '/system/teacherFocus' })
  if (newValue == '8') router.push({ path: '/system/analyzeChar' })
  if (newValue == '9') router.push({ path: '/system/teacherInfo' })
  if (newValue == '10') router.push({ path: '/system/adminfile' })
  if (newValue == '11') router.push({ path: '/system/adduser' })
  if (newValue == '12') router.push({ path: '/system/scales1' })
  if (newValue == '13') router.push({ path: '/system/scales2' })
  if (newValue == '14') {
    centerDialogVisible.value = true
  }
})

const handleLogout = () => {
  router.push({ path: '/' })
}

const checkTips = async () => {
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
  try {
    const response = await axios.get('http://mxt.nat300.top/user/info/', config)
    const data = response.data.data.user
    if (role == 'user' && (data.itodo_1 == 1||data.itodo_2 == 1)) {
      showTip.value = true
      tipText.value = '同学你好，请尽快完成PHQ-9和GAD-7两个量表'
    } else {
      showTip.value = false
    }
  } catch (error) {
    console.error('请求失败', error)
    ElMessage.error('数据加载失败，请稍后重试')
  }
}

onMounted(() => {
  checkTips()
})

// 监听外部事件，主动刷新提示
emitter.on('check-tips', () => {
  checkTips()
})
</script>

<style>
  ::v-deep .el-dialog__title{
  margin-left: 55px !important;
}

* {
  padding: 0;
  margin: 0;
  /* 改盒子高度和长度的计算 */
  box-sizing: border-box;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 600px;
}
body{
   background-color: #d2e7ee;

}
.w{
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
}
.el-menu-item{
  padding: 20px
}
.elitem{
  padding-top: 45px;
  padding-bottom: 45px;
}
.nav{
  width: 200px;
  float: left;
  background-color: #fff;
  height: 660px;
}
.show{
  width: 1000px;
  height: 650px;
  float: left;

}
.contain{
  width: 100vw;
  height: 100vh;

  display: flex;
  /* 交叉轴：竖直 */
  align-items: center;
  /* 主轴水平 */
  justify-content: center;
}
.footer {
  clear: both;
  width: 100%;
  text-align: center;
  padding: 8px 0;
  background-color: #fff;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #eee;
}
/* tips 样式 */
.tips {
  position: absolute;
  top: 20px;
  right: 10px;
  width: 200px;
  height: 140px;
  line-height: 40px;
  text-align: center;
  background-color: #FFE8E8;
  color: #D93025;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  font-size: 16px;
  padding: 5px;
}
.tips:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
</style>
