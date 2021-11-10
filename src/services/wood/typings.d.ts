// @ts-ignore
/* eslint-disable */

declare namespace API {



  type Manager = {
    name?: string;
    sxCode?: string;
    gjCode: string;
    _id?: string
  }
  type UserItem = {
    userName?: string;
    accountName?: string;
    password?: string;
    passwordCheck?: string;
    _id?: string;
  };

  type ErrorDe = {
    error: Boolean;
  };

  type TransformBack = {
    fileName?: string;
    productToday?: API.ProductListItem[];
    newConstomes?: Array<{ id: string, name: string, phone: string }>,
    productNew?: Array<{ code: string, name: string }>
  };

  type DepartmentItem = {
    deName?: string;
    code?: string;
    _id?: string;
  };

  type TransformRule = {
    withStart?: string
    depart?: DepartmentItem & {
      id?: string
    }
    _id?: string
  }

  type LoginResult = {
    status?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type ProductListItem = {
    _id?: string;
    code?: string;
    nameSx?: string;
    nameGj?: string;
    specifications?: string;
    unit?: Array<{ unitSx?: string; unitGj?: string; _id?: string }>;
    updateTime?: number | string;
  };

  type QueryProduct = {
    nameSx?: string;
    nameGj?: string;
    limit?: number;
    page?: number;
    code?: string;
  };

  type QueryManager = {
    limit?: number;
    page?: number;
  };

  type ProductList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    accountName?: string;
    password?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type LabelType = 'DEPARTENT' | 'DISTRICT' | 'CLASS'
  type TagLable = Record<LabelType, { color: string, label: string }>
  type CustomerType = {
    code?: string,
    name?: string,
    deadline?: number | string,
    updateTime?: number | string,
    district?: { code?: string, deName?: string }
    label?: { code?: string, deName?: string }
    oweTotal?: number,
    _id?: string
  }
}

