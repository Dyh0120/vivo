<template>
  <div class="scale-container">
    <!-- 顶部说明文字 -->
    <div class="intro-text">
      <p>亲爱的同学：</p>
      <p style=" text-indent: 2rem;">你好！你即将开始填写的量表是一个专业的心理健康量表，这份量表可以帮助你了解自己的情绪状况，以便及时调整和改善。</p>
      <p style=" text-indent: 2rem;">请你根据自己的真实感受，仔细阅读每个问题和选项，并根据最近一周的真实情况来选择。</p>
    </div>

    <!-- 量表内容 -->
    <el-form :model="answers" label-width="auto" label-position="top">
      <div
        v-for="item in questions"
        :key="item.id"
        class="question-block"
      >
        <div class="question-title">{{ item.id }}. {{ item.question }}</div>
        <el-radio-group v-model="answers[item.id]">
          <el-radio
            v-for="option in item.options"
            :key="option.label"
            :label="option.score"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-button">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import emitter from '@/utils/eventBus'
// 题目数据（焦虑量表）
const questions = [
  {
    id: 1,
    question: '感觉紧张、焦虑或急切',
    options: [
      { label: '没有', score: 0 },
      { label: '有几天', score: 1 },
      { label: '一半以上时间', score: 2 },
      { label: '几乎每天', score: 3 },
    ],
  },
  {
    id: 2,
    question: '不能够停止或控制担忧',
    options: [
      { label: '没有', score: 0 },
      { label: '有几天', score: 1 },
      { label: '一半以上时间', score: 2 },
      { label: '几乎每天', score: 3 },
    ],
  },
  {
    id: 3,
    question: '对各种各样的事情担忧过多',
    options: [
      { label: '没有', score: 0 },
      { label: '有几天', score: 1 },
      { label: '一半以上时间', score: 2 },
      { label: '几乎每天', score: 3 },
    ],
  },
  {
    id: 4,
    question: '很难放松下来',
    options: [
      { label: '没有', score: 0 },
      { label: '有几天', score: 1 },
      { label: '一半以上时间', score: 2 },
      { label: '几乎每天', score: 3 },
    ],
  },
  {
    id: 5,
    question: '由于不安而无法静坐',
    options: [
      { label: '没有', score: 0 },
      { label: '有几天', score: 1 },
      { label: '一半以上时间', score: 2 },
      { label: '几乎每天', score: 3 },
    ],
  },
  {
    id: 6,
    question: '变得容易烦恼或急躁',
    options: [
      { label: '没有', score: 0 },
      { label: '有几天', score: 1 },
      { label: '一半以上时间', score: 2 },
      { label: '几乎每天', score: 3 },
    ],
  },
  {
    id: 7,
    question: '感到似乎将有可怕的事情发生而害怕',
    options: [
      { label: '没有', score: 0 },
      { label: '有几天', score: 1 },
      { label: '一半以上时间', score: 2 },
      { label: '几乎每天', score: 3 },
    ],
  },
]

// 初始化答案
const answers = ref({})

// 提交逻辑
const handleSubmit = async () => {
  if (Object.keys(answers.value).length !== questions.length) {
    ElMessage.error('请完成所有题目后再提交')
    return
  }

  const totalScore = Object.values(answers.value).reduce((sum, val) => sum + val, 0)

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
    await axios.post('http://mxt.nat300.top/user/submit/', {
      id: 2,
      score: totalScore,
    },config)
    ElMessage.success('提交成功！')
     emitter.emit('check-tips')
  } catch (error) {
    console.error(error)
    ElMessage.error('提交失败，请稍后再试')
  }
}
</script>

<style scoped>
.scale-container {
  width: 900px;
  height: 620px;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.intro-text {
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.question-block {
  margin-bottom: 30px;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.submit-button {
  text-align: center;
  margin-top: 20px;
}
</style>
