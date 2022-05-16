import type { PermissionKey } from '../../components/PermissionCN';
export const tagLabel: API.TagLable = {
  CLASS: {
    color: 'purple',
    label: '来源平台',
  },
  DISTRICT: {
    color: 'cyan',
    label: '单据经手人',
  },
  DEPARTENT: {
    color: 'magenta',
    label: '单据部门',
  },
  STAFF: {
    color: 'deepSkyBlue',
    label: '默认业务员',
  },
  BELONG: {
    color: 'orange',
    label: '所属店铺',
  },
  WAREHOUSE: {
    color: 'lightgreen',
    label: '仓库',
  },
};
export const labelItem: {
  label: string;
  value: API.LabelType;
}[] = [
  {
    label: '单据部门',
    value: 'DEPARTENT',
  },
  {
    label: '来源平台',
    value: 'CLASS',
  },
  {
    label: '默认业务员',
    value: 'STAFF',
  },
  {
    label: '单据经手人',
    value: 'DISTRICT',
  },
  {
    label: '所属店铺',
    value: 'BELONG',
  },
  {
    label: '仓库',
    value: 'WAREHOUSE',
  },
];
// '3_OWE' | '1_SERIOUS_DELAY' | '2_HIGH_DELAY'
export const stateColor: API.ColorAndLabel<API.StatusBill> = {
  '2_HIGH_DELAY': {
    color: '#ec911f',
    label: '延期七天内',
  },
  '3_OWE': {
    color: 'rgb(195 189 38)',
    label: '延期三天内',
  },
  '1_SERIOUS_DELAY': {
    color: '#f50',
    label: '延期超七天',
  },
};

export const stateSelect: API.ValueAndLabel<API.StatusBill> = [
  {
    label: '延期三天内',
    value: '3_OWE',
  },
  {
    label: '延期七天内',
    value: '2_HIGH_DELAY',
  },
  {
    label: '延期超七天',
    value: '1_SERIOUS_DELAY',
  },
];

export const aftermarketPro: API.ColorAndLabel<API.AftermarketProcess> = {
  WAITING: {
    color: '#ec911f',
    label: '处理中',
  },
  DONE: {
    color: 'rgb(195 189 38)',
    label: '完成',
  },
};
export const aftermarketRea: API.ColorAndLabel<API.AftermarketReason> = {
  NEEDREFUND: {
    color: '#ec911f',
    label: '只退款',
  },
  NEEDRETURNREFUNF: {
    color: 'rgb(195 189 38)',
    label: '退货退款',
  },
};

export const productChoiceTypeObjDic: Record<API.ProductChoiceType, string> = {
  shixiang: '食享',
  youzan: '有赞总部',
  'youzan.restaurant': '南佐餐饮',
  'youzan.retail': '南佐配送',
  'youzan.wholesale': '一楼A96',
  baseGj: '管家婆',
};
export const productImportTypeDic: {
  value: API.ProductChoiceType;
  name: string;
  permissionKey: PermissionKey
}[] = [
  {
    value: 'baseGj',
    name: productChoiceTypeObjDic.baseGj + '商品价格',
    permissionKey:'product:import:gjPricePrice',
  },
  {
    value: 'youzan',
    permissionKey:'product:import:yzProduct',
    name: productChoiceTypeObjDic.youzan + '总部商品',
  },
  {
    value: 'shixiang',
    permissionKey:'product:import:sxProduct',
    name: productChoiceTypeObjDic.shixiang + '商品',
  },
  {
    value: 'youzan.retail',
    permissionKey:'product:import:yzPrice',
    name: productChoiceTypeObjDic['youzan.retail'] + '网店价格',
  },
  {
    value: 'youzan.restaurant',
    permissionKey:'product:import:yzPrice',

    name: productChoiceTypeObjDic['youzan.restaurant'] + '网店价格',
  },
  {
    value: 'youzan.wholesale',
    permissionKey:'product:import:yzPrice',
    name: productChoiceTypeObjDic['youzan.wholesale'] + '网店价格',
  },
];
export const productChoiceTypeDic: {
  value: API.ProductChoiceType;
  name: string;
}[] = [
  {
    value: 'youzan.retail',
    name: productChoiceTypeObjDic['youzan.retail'],
  },
  {
    value: 'youzan.restaurant',
    name: productChoiceTypeObjDic['youzan.restaurant'],
  },
  {
    value: 'youzan.wholesale',
    name: productChoiceTypeObjDic['youzan.wholesale'],
  },
];
/*
 *  584409832	南佐潮缘线上商城  ---------------->>>>>
 * 386116040	南佐配送（鹏和店）---------------->>>>>农贸生鲜---------->>>01 retail
 * 328208804	南佐潮缘1楼A96号（农都店）------->>>>> 二批价格  -------->>>>03 wholes
 * 643005518	南佐餐饮（鹏和店）---------------->>>>>餐饮价格 ---------->>>06 rest
 * */
export const shopInPrice: Record<string, Record<string, keyof API.ProductDetailType>> = {
  386116040: {
    /* name: '南佐配送（鹏和店）',*/
    price: 'yzretailPrice',
    gjPrice: 'gjretailPrice',
  },
  328208804: {
    /**  name: '南佐潮缘1楼A96号（农都店）' **/
    price: 'yzwholesPrice',
    gjPrice: 'gjwholesPrice',
  },
  643005518: {
    /**  name: '南佐餐饮（鹏和店）',*/
    price: 'yzrestPrice',
    gjPrice: 'gjrestPrice',
  },
};
//名称的对应
export const mingziduiying: Record<
  string,
  Record<API.ProductChoiceType, keyof API.ProductNewType | keyof API.ProductDetailType | '_'>
> = {
  规格: {
    shixiang: 'sxspecifications',
    'youzan.restaurant': 'yzspecifications',
    'youzan.retail': 'yzspecifications',
    'youzan.wholesale': 'yzspecifications',
    baseGj: '_',
    youzan: 'yzspecifications',
  },
  单位: {
    baseGj: '_',
    shixiang: 'sxunit',
    'youzan.restaurant': 'yzunit',
    'youzan.retail': 'yzunit',
    'youzan.wholesale': 'yzunit',
    youzan: 'yzunit',
  },
  价格: {
    baseGj: '_',
    shixiang: '_',
    'youzan.restaurant': 'yzrestPrice',
    'youzan.retail': 'yzretailPrice',
    'youzan.wholesale': 'yzwholesPrice',
    youzan: '_',
  },
  管家价格: {
    shixiang: '_',
    baseGj: '_',
    'youzan.restaurant': 'gjrestPrice',
    'youzan.retail': 'gjretailPrice',
    'youzan.wholesale': 'gjwholesPrice',
    youzan: '_',
  },
  名称: {
    baseGj: '_',
    shixiang: 'sxName',
    'youzan.restaurant': 'yzName',
    'youzan.retail': 'yzName',
    'youzan.wholesale': 'yzName',
    youzan: 'yzName',
  },
};

export const typeDict: Record<API.TypeDic, string> = {
  ADD: '新增',
  UPDATE: '编辑',
};
