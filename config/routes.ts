export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/transform',
    name: 'welcome',
    icon: 'smile',
    component: './transform',
  },
  {
    name: 'customer',
    path: '/customer',
    icon: 'form',
    component: './customer',
  },
  /** 暂时隐藏，功能待加
  {
    name: 'accounting',
    path: '/accounting',
    icon: 'warning',
    component: './accounting',
  },
   */
  {
    name: 'admin',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/projectItems',
    name: 'projectItems',
    icon: 'picCenter',
    component: './projectItems',
  },
  {
    path: '/loginAccount',
    name: 'loginAccount',
    icon: 'car',
    component: './loginAccount',
  },
  // {
  //   path: '/manager',
  //   name: 'manager',
  //   icon: 'contacts',
  //   component: './Manager',
  // },
  {
    path: '/',
    redirect: '/transform',
  },
  {
    component: './404',
  },
];
