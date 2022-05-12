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
  /** 首页   */
  {
    path: '/home',
    name: 'home',
    hideInMenu: true,
    component: './index',
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
      name: 'youzan',
      path: '/transform/youzan',
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
        name: 'choiceManager',
        path: '/customer/choiceManager',
        component: './accounting/choiceManager',

      }, {
        name: 'accounting',
        path: '/customer/choiceManager/:accounting',
        component: './accounting',
        hideInMenu: true,
        parentKeys: ['/customer/choiceManager'],
      }, {
        name: 'transform',
        path: '/customer/transform',
        hideInMenu: true,
        component: './customer/transformCustomer',
      },
      {
        name: 'aftermarket',
        path: '/customer/aftermarket',
        component: './customer/aftersale',
      },
      {
        name: 'oneDetail',
        path: '/customer/details/:id',
        component: './customer/customerBillsDetail',
        hideInMenu: true,
        parentKeys: ['/customer'],
      }, {
        name: 'onePhone',
        path: '/customer/same/:phone',
        component: './customer/customerPhonesDetail',
        hideInMenu: true,
        parentKeys: ['/customer'],
      },
    ],
  },
  /** 商品   */
  {
    name: 'products',
    icon: 'table',
    path: '/products',
    routes: [
      {
        path: '/products/listSx',
        name: 'sx',
        component: './products/TableList',
      }, {
        path: '/products/listYz',
        name: 'yz',
        component: './products/TableListYZ',
      },]
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
    redirect: '/home',
  },
  {
    component: './404',
  },
];
