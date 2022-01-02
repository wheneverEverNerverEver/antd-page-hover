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
  /** 订单转换   */
  {
    path: '/transform',
    name: 'transform',
    icon: 'smile',
    routes: [{
      name: 'shixiang',
      path: '/transform/shixiang',
      component: './transform',
    }, {
      /**未完善，先隐藏 */
      name: 'youzan',
      path: '/transform/youzan',
      hideInMenu: true,
      component: './transform/youzanIndex',
    }]
  },
  /** 客户   */
  {
    path: '/customer',
    icon: 'form',
    name: 'customer',
    routes: [
      {
        name: 'list',
        path: '/customer/list',
        component: './customer',
      },
      {
        name: 'accounting',
        path: '/customer/accounting',
        component: './accounting',
      }, {
        name: 'transform',
        path: '/customer/transform',
        component: './customer/transformCustomer',
      },
      {
        name: 'oneDetail',
        path: '/customer/details/:id',
        component: './customer/customerBillsDetail',
        hideInMenu: true,
        parentKeys: ['/customer/list', '/customer/transform'],
      },
    ],
  },
  /** 商品   */
  {
    name: 'admin',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  /** 分类   */
  {
    path: '/projectItems',
    name: 'projectItems',
    icon: 'picCenter',
    component: './projectItems',
  },

  /** 系统用户相关管理   */
  {
    path: '/treePlanting',
    name: 'treePlanting',
    icon: 'car',
    routes: [
      {
        path: '/treePlanting/account',
        name: 'loginAccount',
        component: './loginAccount',
      }, {
        name: 'role',
        path: '/treePlanting/role',
        component: './role',
      }, {
        name: 'log',
        path: '/treePlanting/log',
        component: './log',
      },
    ],
  },
  {
    path: '/',
    redirect: '/transform/shixiang',
  },
  {
    component: './404',
  },
];
