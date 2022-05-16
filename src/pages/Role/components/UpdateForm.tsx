import React, { useEffect, useRef, useState } from 'react';
import { Button, message, TreeSelect } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { updateRoleData, addRoleData, findAuthData } from '@/services/wood/api';
import type { ActionType } from '@ant-design/pro-table';
import type { DataNode } from 'antd/lib/tree';
import { typeDict } from '@/services/wood/dict';

type UpdateFormProps =API.UpdateFormProps<API.RoleType> & {
  values?: Partial<API.RoleType>;
  refetchTableRef?: React.MutableRefObject<ActionType | undefined>;
};

const OperateRoleProduct: React.FC<UpdateFormProps> = (props) => {
  const { type, values, refetchTableRef } = props;
  const formRef = useRef<ProFormInstance<API.RoleType>>();
  const [treeData, setTreeData] = useState<DataNode[]>()

  useEffect(() => {
    findAuthData({}).then(res => {
      setTreeData(res)
    })
  }, [])


  return (
    <ModalForm<API.RoleType>
      modalProps={{
        destroyOnClose: true,
        maskClosable: false
      }}
      title={`${typeDict[type]}角色`}
      formRef={formRef}
      trigger={
        <Button type="primary" style={{
          marginRight: '20px'
        }}>
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
        let back: API.RoleType | API.ErrorDe;

        try {
          if (type === 'ADD') {
            back = await addRoleData({ ...valuesGot });
            if (!((back as API.ErrorDe)?.error)) {
              message.success(`${typeDict[type]}成功`);
              refetchTableRef?.current?.reload();
              return true;
            }
          }
          if (type === 'UPDATE' && values?._id) {
            back = await updateRoleData(values._id, { ...valuesGot, });
            if (!((back as API.ErrorDe)?.error)) {
              message.success(`${typeDict[type]}成功`);
              refetchTableRef?.current?.reload();
              return true;
            }
          }
        } catch (e) {
          back = { error: true };
        }

        message.error(`${typeDict[type]}失败`);
        refetchTableRef?.current?.reload();
        return false;
      }}
    >
      <ProFormText
        name="roleName"
        label="角色名称"
        disabled={type === 'UPDATE'}
        rules={[
          {
            required: true,
            message: '请输入角色名称',
          },
        ]}
      />
      <ProForm.Item name="pageCode"
        label="可供选择的权限">
        <TreeSelect
          treeData={treeData}
          treeCheckable
        />
      </ProForm.Item>


    </ModalForm>
  );
};

export default OperateRoleProduct;
