<template>
  <div :class="container">
    <form v-if="isPc" class="pc">
      <div class="form_left">
        <h1>欢迎登录</h1>
        <div class="uname">
          <el-icon :size="24"><UserFilled /></el-icon>
          <input type="text" placeholder="学号/工号/账号" v-model="uname" />
        </div>
        <div class="password">
          <el-icon :size="24"><Lock /></el-icon>
          <input type="password" placeholder="密码" v-model="password" />
        </div>
        <div class="identify">
          <input type="text" placeholder="验证码" v-model="cap" />
          <span>
            <img :src="imageSrc" alt="验证码" height="40%" @click="changecap" />
          </span>
        </div>
        <div class="btn">
          <button class="log" @click.prevent="log">登录</button>
        </div>
      </div>
    </form>

    <form v-if="!isPc" class="mobile">
      <h1>欢迎登录</h1>
      <div class="uname">
        <el-icon :size="24"><UserFilled /></el-icon>
        <input type="text" placeholder="学号" v-model="uname" />
      </div>
      <div class="password">
        <el-icon :size="24"><Lock /></el-icon>
        <input type="password" placeholder="密码" v-model="password" />
      </div>
      <div class="remenber">
        <el-checkbox v-model="remenber" label="记住密码" size="large" fill="#f5f5f5" />
      </div>
      <div class="btn">
        <button class="log" @click.prevent="log">登录</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { UserFilled, Lock } from '@element-plus/icons-vue'

const uuid = ref()
const imageSrc = ref(null)
const cap = ref()
const uname = ref('')
const password = ref('')
const loading = ref(false)
const remenber = ref(false)
const container = "container container1"
const router = useRouter()

let isPc = true
const isPC = () => {
  const userAgent = navigator.userAgent
  const mobileAgents = [
    /android/i, /iphone|ipad|ipod/i, /windows phone/i, /blackberry/i, /opera mini/i, /mobile/i, /touch/i
  ]
  isPc = !mobileAgents.some(agent => agent.test(userAgent))
}

const fetchImage = async () => {
  try {
    const response = await fetch('http://mxt.nat300.top/cap/')
    uuid.value = response.headers.get('uuid')
    const blob = await response.blob()
    const dataUrl = URL.createObjectURL(blob)
    imageSrc.value = dataUrl
  } catch (error) {
    console.error('Error fetching image:', error)
  }
}

const changecap = () => fetchImage()

onMounted(() => {
  fetchImage()
  isPC()
  localStorage.clear()
})

const log = async () => {
  try {
    loading.value = true
    const response = await axios.post('http://mxt.nat300.top/user/login/', {
      username: uname.value,
      password: password.value,
      uuid: uuid.value,
      answer: cap.value
    })
    if (response.data.code === 0) {
      ElMessage.success('登录成功')
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('role', response.data.data.role)
      router.push('/System')
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    loading.value = false
    ElMessage.error('登录失败，请稍后重试')
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container1 {
  background: rgba(255, 255, 255, 0.8);
  width: 550px;
  padding: 30px;
  border-radius: 10px;
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.uname, .password, .identify {
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 16px;
}

.uname input, .password input, .identify input {
  flex: 1;
  border: none;
  background-color: transparent;
  padding: 10px;
  font-size: 16px;
  color: #555;
}

.uname input:focus, .password input:focus, .identify input:focus {
  outline: none;
  background-color: #f0f0f0;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #4a80d1;
  border-radius: 8px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #3578d2;
}

img {
  cursor: pointer;
  margin-left: 10px;
}

.el-checkbox {
  margin-left: 10px;
}

.mobile {
  width: 300px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container1 {
    width: 100%;
    padding: 20px;
  }

  .mobile {
    width: 100%;
    padding: 15px;
  }
}

input {
  -webkit-box-shadow: 0 0 0 1000px #f0f0f0 inset;
  border: 0;
  outline: none;
}
</style>
