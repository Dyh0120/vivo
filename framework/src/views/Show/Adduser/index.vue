<template>
  <div class="form-container">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="custom-form"
    >
      <div class="form-row">
        <el-form-item label="账号" prop="username" class="form-item">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="nickname" class="form-item">
          <el-input v-model="form.nickname" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="密码" prop="password" class="form-item">
          <el-input v-model="form.password" show-password />
        </el-form-item>
        <el-form-item label="性别" prop="sex" class="form-item">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="身份" prop="role" class="form-item">
          <el-select v-model="form.role" placeholder="请选择身份">
            <el-option label="学生" value="user" />
            <el-option label="教师" value="teacher" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade" class="form-item">
          <el-input-number v-model="form.grade" :min="2000" :max="2100" />
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="学院" prop="college_id" class="form-item">
          <el-select v-model="form.college_id" placeholder="选择学院">
            <el-option
              v-for="college in colleges"
              :key="college.college_id"
              :label="college.college_name"
              :value="college.college_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="专业" prop="major_id" class="form-item">
          <el-select v-model="form.major_id" placeholder="选择专业">
            <el-option
              v-for="major in majors"
              :key="major.major_id"
              :label="major.major_name"
              :value="major.major_id"
            />
          </el-select>
        </el-form-item>
      </div>

      <div class="form-row">
        <el-form-item label="班级" prop="class_id" class="form-item">
          <el-select v-model="form.class_id" placeholder="选择班级">
            <el-option
              v-for="cls in classes"
              :key="cls.class_id"
              :label="cls.class_name"
              :value="cls.class_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="民族" prop="nationality_id" class="form-item">
          <el-select v-model="form.nationality_id" placeholder="选择民族">
            <el-option
              v-for="nation in nationalities"
              :key="nation.nationality_id"
              :label="nation.nationality_name"
              :value="nation.nationality_id"
            />
          </el-select>
        </el-form-item>
      </div>

      <div class="form-actions">
        <el-button type="primary" @click="submitForm" size="large"  style="padding: 10px; font-size:16px">提交</el-button>
        <el-button @click="resetForm" size="large"  style="padding: 10px; font-size:16px">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

const formRef = ref();
const form = ref({
  username: '',
  nickname: '',
  password: '',
  sex: '',
  role: '',
  college_id: '',
  major_id: '',
  nationality_id: '',
  class_id: '',
  grade: ''
});

const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  role: [{ required: true, message: '请选择身份', trigger: 'change' }],
  grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
  college_id: [{ required: true, message: '请选择学院', trigger: 'change' }],
  major_id: [{ required: true, message: '请选择专业', trigger: 'change' }],
  class_id: [{ required: true, message: '请选择班级', trigger: 'change' }],
  nationality_id: [{ required: true, message: '请选择民族', trigger: 'change' }]
};

const token = localStorage.getItem('token');
const colleges = ref([]);
const majors = ref([]);
const classes = ref([]);
const nationalities = ref([]);

const fetchOptions = async () => {
  try {
    const [collegeRes, majorRes, classRes, nationRes] = await Promise.all([
      axios.get('http://mxt.nat300.top/search/college/'),
      axios.get('http://mxt.nat300.top/search/major/'),
      axios.get('http://mxt.nat300.top/search/class/'),
      axios.get('http://mxt.nat300.top/search/nationality/')
    ]);

    colleges.value = collegeRes.data.data.college_list;
    majors.value = majorRes.data.data.major_list;
    classes.value = classRes.data.data.class_list;
    nationalities.value = nationRes.data.data.nationality_list;
  } catch (error) {
    ElMessage.error('选项加载失败');
  }
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await axios.post(
          'http://mxt.nat300.top/adm/adduser/',
          form.value,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        ElMessage.success('添加成功');
        resetForm();
      } catch (err) {
        ElMessage.error('添加失败');
      }
    }
  });
};

const resetForm = () => {
  formRef.value.resetFields();
};

onMounted(fetchOptions);
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-form {
  width: 900px;
  height: 650px;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-item {
  width: 45%;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
</style>
