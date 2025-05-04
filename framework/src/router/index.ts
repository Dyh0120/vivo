import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import index from '@/views/Login/index.vue'
import system from '@/views/System/index.vue'
import isLogin from '@/api/isLogin'
import analysis from '@/views/Show/Analysis/index.vue'
import linechart from '@/views/Show/Linechart/index.vue'
import record from '@/views/Show/Record/index.vue'
import userinfo from '@/views/Show/Userinfo/index.vue'
import teacherInfo from '@/views/Show/TeacherInfo/index.vue'
import teacherFocus from '@/views/Show/TeacherFocus/index.vue'
import teacherSearchFile from '@/views/Show/TeacherSearchFile/index.vue'
import adminfile from '@/views/Show/Adminfile/index.vue'
import adduser from '@/views/Show/Adduser/index.vue'
import analyzeChar from '@/components/AnalyzeChar.vue'
import scales1 from '@/views/Show/Scales1/index.vue'
import scales2 from '@/views/Show/Scales2/index.vue'
import NotFoundView from '@/components/views/NotFoundView.vue';
//创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:'/',
      component:Login
    },
    {
      path: '/system',
      name: 'system',
      component: system,
    children: [
      {
        path: 'analysis',
        name: 'analysis',
        component: analysis,
      },
      {
        path: 'linechart',
        name: 'linechart',
        component: linechart,
      },
      {
        path: 'record',
        name: 'record',
        component: record,
      },
      {
        path: 'userinfo',
        name: 'userinfo',
        component: userinfo,
      },
      {
        path: 'teacherInfo',
        name: 'teacherInfo',
        component: teacherInfo,
      },
      {
        path: 'teacherFocus',
        name: 'teacherFocus',
        component: teacherFocus,
      },
      {
        path: 'teacherSearchFile',
        name: 'teacherSearchFile',
        component: teacherSearchFile,
      },
      {
        path: 'analyzeChar',
        name: 'analyzeChar',
        component: analyzeChar,
      },
       {
        path: 'adminfile',
        name: 'adminfile',
        component: adminfile,
      },
      {
        path: 'adduser',
        name: 'adduser',
        component: adduser,
      },
      {
        path: 'scales1',
        name: 'scales1',
        component: scales1,
      },
       {
        path: 'scales2',
        name: 'scales2',
        component: scales2,
      },
      // 其他二级路由...
    ],
    },
    // {
    //   path: '/:pathMatch(.*)*', // 匹配所有未定义的路由
    //   name: 'NotFound',
    //   component: NotFoundView,
    // },
  ],
})

// router.beforeEach(async (to, from, next) => {
//   try {
//     const role = localStorage.getItem('role') || ''; // 从 localStorage 获取角色
//     const isLoggedIn = await isLogin(); // 检查登录状态
//     const publicPaths = ['/']; // 允许未登录访问的路径
//     if (!isLoggedIn && !publicPaths.includes(to.path)) {
//       const redirectUrl = `${window.location.origin}${to.fullPath}`;
//       return (window.location.href = `http://localhost:5173`);
//     }

//     next(); // 继续导航
//   } catch (error) {
//     console.error('导航守卫出错:', error);
//     next('/'); // 出错时默认跳转到登录页
//   }
// });



// router.afterEach((to, from) => {
//   const query = { ...to.query };
//   if ('token' in query) delete query.token;
//   if ('role' in query) delete query.role;
//   if (JSON.stringify(query) !== JSON.stringify(to.query)) {
//     const newPath = to.path.replace(/\/+/g, '/');
//     router.replace({ path: newPath, query });
//   }
// });

//暴露出去router
export default router
