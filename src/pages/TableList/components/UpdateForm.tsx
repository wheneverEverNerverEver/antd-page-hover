import React, { useRef } from 'react';
import { Button, message } from 'antd';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormList,
  ProFormInstance,
} from '@ant-design/pro-form';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { updateProductData, addProductData } from '@/services/wood/api';
import { ActionType } from '@ant-design/pro-table';

export type FormValueType = Partial<API.ProductListItem>;

type TypeDic = 'ADD' | 'UPDATE';

export type UpdateFormProps = {
  onCancel?: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit?: (values: FormValueType) => Promise<void>;
  values?: Partial<API.ProductListItem>;
  type: TypeDic;
  refetchTableRef?: React.MutableRefObject<ActionType | undefined>;
};
const typeDict: Record<TypeDic, string> = {
  ADD: '新增',
  UPDATE: '编辑',
};

const OperateProduct: React.FC<UpdateFormProps> = (props) => {
  const { type, values, refetchTableRef } = props;
  const formRef = useRef<ProFormInstance<API.ProductListItem>>();
  return (
    <ModalForm<API.ProductListItem>
      title={`${typeDict[type]}商品`}
      formRef={formRef}
      trigger={
        <Button type="primary">
          {type === 'ADD' ? <PlusOutlined /> : <EditOutlined />}
          {`${typeDict[type]}`}
        </Button>
      }
      initialValues={values}
      onVisibleChange={(ifShow) => {
        if (!ifShow) {
          formRef.current?.resetFields();
        }
      }}
      onFinish={async (valuesGot) => {
        let back: API.ProductListItem | Boolean = false;
        if (type === 'ADD') {
          back = await addProductData({ ...valuesGot });
        }
        if (type === 'UPDATE' && values?._id) {
          back = await updateProductData({ ...valuesGot, _id: values._id });
        }
        if (back) {
          message.success(`${typeDict[type]}成功`);
          refetchTableRef?.current?.reload();
          return true;
        } else {
          message.error(`${typeDict[type]}失败`);
          refetchTableRef?.current?.reload();
          return false;
        }
      }}
    >
      <ProFormText
        name="code"
        label="共同编码"
        rules={[
          {
            required: true,
            message: '请输入共同编码！',
          },
        ]}
      />
      <ProFormText
        name="nameSx"
        label="食享名称"
        rules={[
          {
            required: true,
            message: '请输入食享名称！',
          },
        ]}
      />
      <ProFormText name="nameGj" label="管家婆名称" />
      <ProFormText name="specifications" label="规格" />
      <ProFormList
        name="unit"
        label="单位对应"
        creatorButtonProps={{
          position: 'bottom',
        }}
        initialValue={type === 'ADD' ? [{ unitSx: '箱', unitGj: '箱' }] : undefined}
      >
        <ProForm.Group>
          <ProFormText name="unitSx" label="食享单位" />
          <ProFormText name="unitGj" label="姓管家婆单位" />
        </ProForm.Group>
      </ProFormList>
    </ModalForm>
  );
};

export default OperateProduct;
