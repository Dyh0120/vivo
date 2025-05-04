
<template>
  <div class="chat-container">
  <!-- 加一个框“蓝心大模型” -->
      <div class="bot-name">蓝心大模型</div>
    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <!-- 头像 -->
        <img v-if="message.sender === 'bot'" src="../../../assets/image.png" alt="Bot Avatar" class="avatar" />
        <div class="message-content">
          <div v-if="message.sender === 'bot' && message.isTyping" class="typing-text">
            <span>{{ message.displayText }}</span>
            <span class="cursor"></span>
          </div>
          <div v-else class="formatted-text" v-html="formatMessage(message.text)"></div>
          <!-- 加载效果 -->
          <div v-if="message.loading" class="loading">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 回到顶端按钮 -->
    <button v-if="showScrollToTop" @click="scrollToTop" class="scroll-to-top-btn">
      回到顶部
    </button>

    <!-- 输入框 -->
    <div class="chat-input">
      <textarea
        v-model="userInput"
        :disabled="isBotResponding"
        @keyup.enter="handleButtonClick"
        placeholder="输入你的问题..."
        ref="textarea"
        @input="adjustTextareaHeight"
      ></textarea>
      <!-- 语音输入按钮 -->
      <button @click="toggleRecording" :disabled="isBotResponding">
        {{ isRecording ? '停止录音' : '开始录音' }}
      </button>
      <button @click="handleButtonClick" :disabled="!userInput.trim() && !isBotResponding">
        {{ isBotResponding ? '发送中..' : '点击发送' }}
      </button>
    </div>

    <!-- 语音确认弹窗 -->
    <el-dialog
      title="确认发送语音"
      v-model="isDialogVisible"
      width="300px"
      @close="cancelDialog"
    >
      <span>你录制了语音消息，是否发送？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="sendVoiceMessage">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.bot-name {
  align-self: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50; /* 深灰蓝，稳重现代 */
  margin-bottom: 1vh;
  padding: 0.4vw 1vw;
  border-radius: 8px;
  background-color: #f0f4f8; /* 柔和浅灰底 */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

/* 容器样式 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5vw;
  box-sizing: border-box;
  background-color: #f8f9fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.el-select {
  margin: 0 auto 1.5vw auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}

/* 聊天消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1vw;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1vw;
  scroll-behavior: smooth; /* 添加平滑滚动效果 */
}

/* 消息样式 */
.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.2vw;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.bot {
  justify-content: flex-start;
}

.message.user {
  justify-content: flex-end;
  align-items: flex-end;
}

/* 头像样式 */
.avatar {
  width: 3.5vw;
  height: 3.5vw;
  border-radius: 50%;
  margin-right: 1vw;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  object-fit: cover;
  border: 2px solid #fff;
}

/* 消息内容样式 */
.message-content {
  max-width: 65%;
  padding: 1vw 1.2vw;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.message.bot .message-content {
  background-color: #f0f2f5;
  border-bottom-left-radius: 4px;
}

.message.user .message-content {
  background: linear-gradient(135deg, #0061a7, #003b65);
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* 消息文本样式改进 */
.message-content .formatted-text {
  margin: 0;
  padding: 0;
  word-wrap: break-word;
  white-space: normal;
  font-size: 1rem;
  line-height: 1.5;
}

.message-content .formatted-text p {
  margin: 0 0 0.8em 0;
}

.message-content .formatted-text p:last-child {
  margin-bottom: 0;
}

/* 打字效果样式 */
.typing-text {
  font-size: 1rem;
  line-height: 1.5;
}

.cursor {
  display: inline-block;
  width: 0.5em;
  height: 1em;
  background-color: #333;
  margin-left: 2px;
  vertical-align: text-top;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

/* 加载效果样式 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.8vw;
}

.dot {
  width: 0.8vw;
  height: 0.8vw;
  margin: 0 0.3vw;
  background-color: #999;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-0.8vw);
  }
}

/* 回到顶部按钮 */
.scroll-to-top-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #005C97;
  color: #fff;
  border: none;
  padding: 0.8vw 1.2vw;
  border-radius: 50px;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 92, 151, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100; /* 确保按钮始终在最上层 */
}

.scroll-to-top-btn:hover {
  background-color: #004a7a;
  transform: translateY(-2px);
}

/* 输入框样式 */
.chat-input {
  display: flex;
  align-items: flex-end;
  padding: 1vw;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.chat-input textarea {
  flex: 1;
  padding: 1vw;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  resize: none;
  overflow-y: auto;
  max-height: 15vh;
  white-space: pre-wrap;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  font-family: inherit;
}

.chat-input textarea:focus {
  border-color: #005C97;
  box-shadow: inset 0 1px 3px rgba(0, 92, 151, 0.2);
}

.chat-input button {
  margin-left: 1vw;
  padding: 0.8vw 1.5vw;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 语音按钮 */
.chat-input button:first-of-type {
  background-color: #6c757d;
  box-shadow: 0 3px 8px rgba(108, 117, 125, 0.3);
}

.chat-input button:first-of-type:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

/* 发送按钮 - 特别样式 */
.chat-input button:last-of-type {
  background: linear-gradient(135deg, #0061a7, #003b65);
  padding: 0.9vw 1.8vw;
  box-shadow: 0 4px 10px rgba(0, 92, 151, 0.3);
  position: relative;
  overflow: hidden;
}

.chat-input button:last-of-type:hover {
  background: linear-gradient(135deg, #005C97, #003054);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 92, 151, 0.4);
}

.chat-input button:last-of-type:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(0, 92, 151, 0.3);
}

.chat-input button:disabled {
  background: #b0b0b0;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 对话框样式 */
.el-dialog {
  border-radius: 15px;
  overflow: hidden;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.dialog-footer button {
  margin-left: 10px;
}

/* 响应式字体大小调整 (桌面端) */
@media (min-width: 768px) {
  .chat-container {
    padding: 1vw;
  }

  .chat-messages {
    padding: 0.8vw;
  }

  .message {
    margin-bottom: 0.8vw;
  }

  .message-content {
    padding: 0.8vw 1vw;
    max-width: 60%;
  }

  .message-content .formatted-text {
    font-size: 0.95rem;
  }

  .typing-text {
    font-size: 0.95rem;
  }

  .avatar {
    width: 2.8vw;
    height: 2.8vw;
  }

  .dot {
    width: 0.6vw;
    height: 0.6vw;
  }

  .chat-input {
    padding: 0.8vw;
  }

  .chat-input textarea {
    font-size: 0.95rem;
    padding: 0.8vw;
  }

  .chat-input button {
    padding: 0.7vw 1.2vw;
    font-size: 0.9rem;
  }

  .chat-input button:last-of-type {
    padding: 0.8vw 1.5vw;
  }

  .scroll-to-top-btn {
    font-size: 0.9rem;
    padding: 0.6vw 1vw;
  }
}

/* 动画和交互效果 */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.chat-input button:last-of-type:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}

.chat-input button:last-of-type:active:after {
  animation: ripple 0.6s ease-out;
}
</style>

<script setup>
import { ref, reactive, nextTick, watch, onMounted } from 'vue';
import axios from 'axios';
import { ElDialog, ElButton, ElMessage } from 'element-plus';


// 本地消息数据
const messages = reactive([
  { 
    sender: 'bot', 
    text: '你好！我是你的助手，有什么可以帮你的吗？', 
    loading: false,
    isTyping: false,
    displayText: ''
  },
]);

// 输入框和录音控制
const userInput = ref('');
const isBotResponding = ref(false);
const chatMessages = ref(null);
const textarea = ref(null);
const showScrollToTop = ref(false);
const token = localStorage.getItem('token');

// 录音状态
const isRecording = ref(false);
let audioChunks = [];
let mediaRecorder = ref(null);
const isDialogVisible = ref(false);

// 麦克风权限状态
const micPermissionStatus = ref('未请求'); // 可能的值: '未请求', '已授权', '已拒绝', '请求中'

// 用于打字动画效果
let typingInterval = null;
const typingSpeed = 30; // 打字速度，单位毫秒

// 格式化消息，保持段落结构
const formatMessage = (text) => {
  if (!text) return '';
  
  // 将文本中的段落分隔符转换为HTML段落
  return text.split('\n\n')
    .filter(para => para.trim() !== '')
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
};

// 监听消息变化，滚动到底部
watch(
  () => messages.length,
  () => {
    scrollToBottom();
  }
);

// 监听聊天区域的滚动，控制回到顶部按钮显示
watch(
  () => chatMessages.value ? chatMessages.value.scrollTop : 0,
  (scrollTop) => {
    if (!chatMessages.value) return;
    
    const chatMessagesHeight = chatMessages.value.scrollHeight;
    const visibleHeight = chatMessages.value.clientHeight;
    const scrolledFromBottom = chatMessagesHeight - scrollTop - visibleHeight;
    
    showScrollToTop.value = scrollTop > 100;
  }
);

// 在组件挂载后
onMounted(() => {
  // 确保初始消息显示时也滚动到底部
  scrollToBottom();
  
  // 监听消息内容变化，以处理机器人正在输入时的滚动
  watch(
    () => messages.map(m => m.text),
    () => scrollToBottom(),
    { deep: true }
  );
  
  // 监听窗口大小变化，调整滚动位置
  window.addEventListener('resize', scrollToBottom);
  
  // 自动聚焦到输入框
  if (textarea.value) {
    textarea.value.focus();
  }
  
  // 检查麦克风权限状态
  checkMicrophonePermission();
  
  // 在组件卸载时清除事件监听
  return () => {
    window.removeEventListener('resize', scrollToBottom);
    // 清除任何可能存在的打字动画计时器
    if (typingInterval) {
      clearInterval(typingInterval);
    }
  };
});

// 检查麦克风权限状态
const checkMicrophonePermission = async () => {
  try {
    // 查询已有权限
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
    
    if (permissionStatus.state === 'granted') {
      micPermissionStatus.value = '已授权';
    } else if (permissionStatus.state === 'denied') {
      micPermissionStatus.value = '已拒绝';
    } else {
      micPermissionStatus.value = '未请求';
    }
    
    // 监听权限变化
    permissionStatus.onchange = () => {
      if (permissionStatus.state === 'granted') {
        micPermissionStatus.value = '已授权';
      } else if (permissionStatus.state === 'denied') {
        micPermissionStatus.value = '已拒绝';
      }
    };
  } catch (error) {
    console.error('无法查询麦克风权限状态:', error);
  }
};

// 请求麦克风权限
const requestMicrophonePermission = async () => {
  if (micPermissionStatus.value === '已授权') {
    return true;
  }
  
  try {
    micPermissionStatus.value = '请求中';
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // 立即释放获取的流，因为我们只是在检查权限
    stream.getTracks().forEach(track => track.stop());
    
    micPermissionStatus.value = '已授权';
    return true;
  } catch (error) {
    console.error('麦克风权限请求被拒绝:', error);
    micPermissionStatus.value = '已拒绝';
    ElMessage.error('无法访问麦克风，请在浏览器设置中允许访问麦克风');
    return false;
  }
};

// 模拟打字效果
const startTypingAnimation = (messageIndex, fullText) => {
  let charIndex = 0;
  const message = messages[messageIndex];
  message.displayText = '';
  message.isTyping = true;
  
  // 清除可能存在的之前的打字动画
  if (typingInterval) {
    clearInterval(typingInterval);
  }
  
  typingInterval = setInterval(() => {
    if (charIndex < fullText.length) {
      message.displayText += fullText.charAt(charIndex);
      charIndex++;
      scrollToBottom();
    } else {
      clearInterval(typingInterval);
      message.isTyping = false;
      message.text = fullText;
      scrollToBottom();
    }
  }, typingSpeed);
};

// 处理按钮点击事件
const handleButtonClick = () => {
  if (isBotResponding.value) {
    stopBotResponse(); 
  } else {
    sendMessage(); 
  }
};

// // 停止机器人响应
// const stopBotResponse = () => {
//   // 停止API请求
//   isBotResponding.value = false;
  
//   // 停止打字动画
//   if (typingInterval) {
//     clearInterval(typingInterval);
//     typingInterval = null;
//   }
  
//   // 将最后一条正在加载的消息设为停止状态
//   const lastMessage = messages[messages.length - 1];
//   if (lastMessage && lastMessage.loading) {
//     lastMessage.loading = false;
//     lastMessage.isTyping = false;
//     lastMessage.text = lastMessage.text || '(响应已停止)';
//   }
// };

// 发送文本消息
const sendMessage = async () => {
  if (userInput.value.trim() === '') return;

  // 添加用户消息
  messages.push({ sender: 'user', text: userInput.value, loading: false });
  const userMessage = userInput.value;
  userInput.value = '';

  // 重置输入框高度
  adjustTextareaHeight();
  // 滚动到底部，确保用户消息可见
  scrollToBottom();
  
  // 模拟机器人回复延迟
  isBotResponding.value = true;
  messages.push({ 
    sender: 'bot', 
    text: '', 
    loading: true,
    isTyping: false,
    displayText: ''
  });
  
  try {
    const response = await axios.post('http://mxt.nat300.top/dialogue/dia/', 
    {
      model:'vivo',
      question: userMessage,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }}
    );

    // 模拟机器人回答
    const botAnswer = response.data.data.answer; 
    setTimeout(() => {
      const botMessageIndex = messages.length - 1;
      // 移除加载状态
      messages[botMessageIndex].loading = false;
      
      // 开始打字动画
      startTypingAnimation(botMessageIndex, botAnswer);
      
      // 在打字效果完成后将状态改回
      setTimeout(() => {
        isBotResponding.value = false;
      }, botAnswer.length * typingSpeed + 500);
      
    }, 800); // 减少延迟，因为打字效果本身会造成一定的延迟体验

  } catch (error) {
    messages.pop(); 
    messages.push({ 
      sender: 'bot', 
      text: '抱歉，我无法获取答案。请稍后再试。', 
      loading: false,
      isTyping: false
    });
    isBotResponding.value = false;
    // 错误消息也要滚动到底部
    scrollToBottom();
  }
};

// 滚动到底部 - 增强版
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      // 使用平滑滚动效果滚动到底部
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });
};

// 滚动到顶部
const scrollToTop = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = 0;
  }
};

const toggleRecording = async () => {
  // 首先检查/请求麦克风权限
  const hasPermission = await requestMicrophonePermission();
  
  if (!hasPermission) {
    return; // 如果没有权限，不继续执行
  }
  
  if (isRecording.value) {
    // 停止录音
    mediaRecorder.value.stop();
    isRecording.value = false;
  } else {
    // 开始录音
    await startRecording();
    isRecording.value = true;
  }
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    audioChunks = []; // 清空之前的录音数据
    
    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

      // 需要转换格式
      const convertedBlob = await convertToWav(audioBlob);
      // 录音停止后弹出确认框
      isDialogVisible.value = true;
      // 传递转换后的音频
      audioChunks = [convertedBlob];

      // 确保录音状态被正确设置为 false
      isRecording.value = false;
    };

    mediaRecorder.value.start();
  } catch (error) {
    console.error('Error accessing audio devices:', error);
    ElMessage.error('无法访问麦克风，请检查设备权限');
    micPermissionStatus.value = '已拒绝';
  }
};

const convertToWav = async (webmBlob) => {
  const audioContext = new AudioContext();
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // 将音频数据转换为 PCM WAV
  return encodeWav(audioBuffer);
};

const encodeWav = (audioBuffer) => {
  const numOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM format
  const bitDepth = 16;

  let interleaved;
  if (numOfChannels === 2) {
    interleaved = interleave(audioBuffer.getChannelData(0), audioBuffer.getChannelData(1));
  } else {
    interleaved = audioBuffer.getChannelData(0);
  }

  const wavBuffer = new ArrayBuffer(44 + interleaved.length * 2);
  const view = new DataView(wavBuffer);

  writeWavHeader(view, sampleRate, numOfChannels, bitDepth);
  writeWavPCM(view, interleaved, bitDepth);

  return new Blob([view], { type: 'audio/wav' });
};

const writeWavHeader = (view, sampleRate, numChannels, bitDepth) => {
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + sampleRate * numChannels * (bitDepth / 8), true); // File size
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // Format (PCM)
  view.setUint16(22, numChannels, true); // Channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // Byte rate
  view.setUint16(32, numChannels * (bitDepth / 8), true); // Block align
  view.setUint16(34, bitDepth, true); // Bits per sample
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, sampleRate * numChannels * (bitDepth / 8), true); // Data size
};

const writeWavPCM = (view, samples, bitDepth) => {
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    let sample = Math.max(-1, Math.min(1, samples[i]));
    sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(offset, sample, true);
  }
};

const interleave = (left, right) => {
  const length = left.length + right.length;
  const result = new Float32Array(length);
  let index = 0,
    inputIndex = 0;
  while (index < length) {
    result[index++] = left[inputIndex];
    result[index++] = right[inputIndex];
    inputIndex++;
  }
  return result;
};

// 取消弹窗
const cancelDialog = () => {
  isDialogVisible.value = false;
  // 释放麦克风资源
  if (mediaRecorder.value && mediaRecorder.value.stream) {
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
};

// 发送录音
const sendVoiceMessage = async () => {
  if (!token) {
    ElMessage.error('请先登录！');
    return;
  }
  cancelDialog();
  const audioBlob = audioChunks[0];  // 这里使用转换后的 WAV 格式
  const formData = new FormData();
  formData.append('audio_file', audioBlob, 'recording.wav');
  // formData.append('model', 'vivo');

  try {
    // 添加一个临时的用户消息，显示正在处理
    messages.push({ sender: 'user', text: '语音消息处理中...', loading: true });
    scrollToBottom();
    
    const response = await fetch('http://mxt.nat300.top/dialogue/blue/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      ElMessage.success('发送成功');
      const data = await response.json();
      
      // 更新之前的临时消息
      messages.pop();
      messages.push({ sender: 'user', text: `${data.data.question}`, loading: false });
      
      // 添加机器人响应
      isBotResponding.value = true;
      messages.push({ 
        sender: 'bot', 
        text: '', 
        loading: true,
        isTyping: false,
        displayText: ''
      });
      
      // 延迟一下显示回答，模拟真实对话
      setTimeout(() => {
        const botMessageIndex = messages.length - 1;
        // 移除加载状态
        messages[botMessageIndex].loading = false;
        
        // 开始打字动画
        startTypingAnimation(botMessageIndex, data.data.answer);
        
        // 在打字效果完成后将状态改回
        setTimeout(() => {
          isBotResponding.value = false;
        }, data.data.answer.length * typingSpeed + 500);
        
      }, 800);
      
    } else {
      messages.pop(); // 移除临时消息
      ElMessage.error('语音处理失败，请重试');
    }
  } catch (error) {
    messages.pop(); // 移除临时消息
    ElMessage.error('发送失败');
    console.error('发生错误:', error);
  }

  
  // 确保处理完后滚动到底部
  scrollToBottom();
};
// 动态调整输入框高度
const adjustTextareaHeight = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = `${Math.min(textarea.value.scrollHeight, window.innerHeight * 0.3)}px`; 
  }
};
</script>

