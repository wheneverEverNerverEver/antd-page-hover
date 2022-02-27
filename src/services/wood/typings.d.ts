// @ts-ignore
/* eslint-disable */

declare namespace API {

  type BackFromUp = {
    error: boolean
  }


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
    role?: string;
    roleObj?: RoleType
    roleCode?: string[]
  };

  type ErrorDe = {
    error: Boolean;
  };

  type TransformBack = {
    fileName?: string;
    productToday?: API.ProductListItem[];
    newConstomes?: Array<{ id: string, name: string, phone: string }>,
    productNew?: Array<{ code: string, name: string }>
    samePhone?: Array<{ phone: string }>
  };

  type DepartmentItem = {
    deName?: string;
    code?: string;
    _id?: string;
    showInMenu?: boolean
    count?: number
    label?: LabelType
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
    deName?: string
    name?: string
    manager?: string
    phone?: string
    sort?: string
  };
  type BaseQuery = {
    limit?: number;
    page?: number;
  }

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

  type LabelType = 'DEPARTENT' | 'DISTRICT' | 'CLASS' | 'STAFF' | 'BELONG' | 'WAREHOUSE'
  type TagLable = Record<LabelType, { color: string, label: string }>
  type ColorAndLabel<T> = Record<T, { color: string, label: string }>
  type ValueAndLabel<T> = Array<{ value: T, label: string }>
  type CodeNameType = { code?: string, deName?: string, name?: string }
  type CustomerType = {
    code?: string,
    name?: string,
    deadline?: number | string,
    updateTime?: number | string,
    district?: CodeNameType
    label?: CodeNameType
    manager?: CodeNameType
    delivery?: CodeNameType
    oweTotal?: number,
    trUsed?: number,
    phone?: number
    _id?: string
  }

  type StatusBill = '3_OWE' | '1_SERIOUS_DELAY' | '2_HIGH_DELAY'

  type BillType = {
    startTime?: string | number,
    customer?: CodeNameType & {
      oweTotal?: number
    },
    endTime?: string,
    state?: StatusBill, /** 订单状态 */
    amount?: number, /** 金额 */
    orderCode?: string,
    manager?: CodeNameType, /** 经手人*/
    delivery?: CodeNameType, /** 配送人*/
    img?: string
    _id?: string
    imgUploader?: string
  }
  type LabelTypeOption = { label?: string, value?: string }
  type QueryBillObj = {
    limit?: number;
    page?: number;

    //仅对名称查询
    customer?: LabelTypeOption
    orderCode?: string
    manager?: LabelTypeOption
    delivery?: LabelTypeOption,
    startTime?: string[]
    amount?: string
    state?: StatusBillWord
  };
  type QueryBill = {
    limit?: number;
    page?: number;

    //仅对名称查询
    customer?: string
    orderCode?: string
    manager?: string
    delivery?: string
    amount?: string
    state?: StatusBillWord
  };
  type PageType = {
    url?: string,
    pageName?: string,
    pageCode?: string,
    _id?: string,
  }
  type LogType = {
    operationTime?: string | number,
    operationDetail?: string,
    operator?: string,
    operatorObj?: UserItem
    _id?: string,
  }
  type RoleType = {
    roleName?: string | number
    pageCode?: string[]
    _id?: string,
    pageCodeArr?: PageType[]
  }
  type ProductyzType = {
    code?: string,
    barCode?: string,
    name?: string,
    _id?: string,
  }
  type ProductYzTransform = {
    warehouse?: string,
    department?: string,
    belong?: string,
  }
}

