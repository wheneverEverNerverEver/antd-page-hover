/* eslint-disable no-underscore-dangle */
import React, { useRef } from 'react';
import { Button, message, Typography } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { updateCustomerData, addCustomerData } from '@/services/wood/api';
import type { ActionType } from '@ant-design/pro-table';

export type FormValueType = Partial<API.CustomerType>;

type TypeDic = 'ADD' | 'UPDATE';

export type UpdateFormProps = {
    onCancel?: (flag?: boolean, formVals?: FormValueType) => void;
    onSubmit?: (values: FormValueType) => Promise<void>;
    values?: Partial<API.CustomerType>;
    type: TypeDic;
    refetchTableRef?: React.MutableRefObject<ActionType | undefined>;
};
const typeDict: Record<TypeDic, string> = {
    ADD: '新增',
    UPDATE: '编辑',
};

const OperateTransform: React.FC<UpdateFormProps> = (props) => {
    const { type, values, refetchTableRef } = props;
    const formRef = useRef<ProFormInstance<API.CustomerType>>();
    return (
        <ModalForm<API.CustomerType>
            title={`${typeDict[type]}客户`}
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
                let back: API.CustomerType | API.ErrorDe;
                try {
                    if (type === 'ADD') {

                        back = await addCustomerData({ ...valuesGot });
                        if (!((back as API.ErrorDe)?.error)) {
                            message.success(`${typeDict[type]}成功`);
                            refetchTableRef?.current?.reload();
                            return true;
                        }
                    }
                    if (type === 'UPDATE' && values?._id) {
                        back = await updateCustomerData({ ...valuesGot, _id: values._id });
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
            <Typography.Title level={5}>
                客户名称：{values?.name}</Typography.Title >
            <Typography.Title level={5}>线路分配：{values?.district?.deName}</Typography.Title >
            <Typography.Title level={5}>类别：{values?.label?.deName}</Typography.Title >
            <ProFormText
                valueType={"number"}
                name="deadline"
                label="账期允可长度（天）"
                rules={[
                    {
                        required: true,
                        message: '暂时只支持以什么第三方用户ID为开头的分一类，必填',
                    },
                ]}
            />

        </ModalForm>
    );
};

export default OperateTransform;
