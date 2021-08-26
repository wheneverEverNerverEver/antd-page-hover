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
  {
    path: '/',
    redirect: '/transform',
  },
  {
    component: './404',
  },
];
