/* eslint-disable no-underscore-dangle */
import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { ProFormTextArea } from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { updateAftersaleData, addftersaleData, findCustomerData, findDepartmentData } from '@/services/wood/api';
import asyncDebounce from '@/components/asyncDebounce';
import { labelValueEnd } from '@/pages/accounting';
import { typeDict } from '@/services/wood/dict';

type FormValueTypePA = API.FormValueType<API.AftermarketType>;


type UpdateFormPropsPA =  API.UpdateFormProps<API.AftermarketType> & {
    values?: FormValueTypePA & {
        customerObj?: API.CustomerType,
        deliveryObj?: API.DepartmentItem
    },
};

const OperateProductAftermarket: React.FC<UpdateFormPropsPA> = (props) => {
    const { type, values, refetch } = props;
    const formRef = useRef<ProFormInstance<API.AftermarketType>>();
    const afterCoumDebouce = asyncDebounce(async (name) => {
        const dataCome = await findCustomerData({
            name: name?.keyWords ?? (values?.customerObj?.name),
            page: 1,
            limit: 20
        })
        return labelValueEnd(dataCome?.data || [], 'name', 'code')
    }, 300)

    const afterDeliveryDebouce = asyncDebounce(async (name) => {
        const dataCome = await findDepartmentData({
            deName: name?.keyWords ?? (values?.deliveryObj?.deName),
            limit: 10,
            page: 1,
            label: 'DEPARTENT'
        })
        return labelValueEnd(dataCome?.data || [], 'deName', 'code')
    }, 300)

    return (
        <ModalForm<API.AftermarketType>
            modalProps={{
                destroyOnClose: true,
                maskClosable: false,
                keyboard: false
            }}
            layout="horizontal"
            title={`${typeDict[type]}售后记录`}
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
                let back: API.AftermarketType | API.ErrorDe;

                if (typeof (valuesGot?.imgFromCus) !== 'string') {

                    const imageValue = valuesGot.imgFromCus
                    // eslint-disable-next-line no-param-reassign
                    valuesGot.imgFromCus = (imageValue as any)?.[0]?.originFileObj;
                }
                try {
                    if (type === 'ADD') {
                        back = await addftersaleData(valuesGot);
                        if (!((back as API.ErrorDe)?.error)) {
                            message.success(`${typeDict[type]}成功`);
                            refetch?.();
                            return true;
                        }
                    }
                    if (type === 'UPDATE' && values?._id) {
                        back = await updateAftersaleData({ ...valuesGot, _id: values?._id });
                        if (!((back as API.ErrorDe)?.error)) {
                            message.success(`${typeDict[type]}成功`);
                            refetch?.();
                            return true;
                        }
                    }
                } catch (e) {
                    back = { error: true };
                }

                message.error(`${typeDict[type]}失败`);

                return false;
            }}
        >
            <ProFormText
                name="orderCode"
                label="对应订单号"
                extra="在管家婆中的对应订单号"
                rules={[
                    {
                        required: true,
                        message: '对应订单号是必填的',
                    },
                ]}
                disabled={type === 'UPDATE'}
            />

            <ProFormSelect
                name="customer"
                label="客户名称"
                disabled={type === 'UPDATE'}
                rules={[
                    {
                        required: true,
                        message: '请选择客户！',
                    },
                ]}
                showSearch
                request={afterCoumDebouce as any}
            />

            <ProFormRadio.Group
                style={{
                    margin: 16,
                }}
                label="售后类型"
                radioType="button"
                name="reasonType"
                valueEnum={{
                    NEEDREFUND: '仅退款',
                    NEEDRETURNREFUNF: '退货退款'
                }}
                rules={[
                    {
                        required: true,
                        message: '请选择售后类型',
                    },
                ]}
            />
            <ProFormSelect
                name="delivery"
                label="配送员"
                request={afterDeliveryDebouce as any}
                showSearch

            />
            {
                type === 'UPDATE' ? (
                    <div>
                        <img src={values?.imgFromCus} />
                    </div>
                ) : (
                    <ProFormUploadButton
                        extra="支持扩展名：.jpg .png .jpeg"
                        accept='image/png,image/jpg,image/jpeg'
                        label="售后截图"
                        name="imgFromCus"
                        title="上传图片"
                        max={1}
                        rules={[
                            {
                                required: true,
                                message: '请上传图片',
                            },
                        ]}
                    />
                )
            }

            <ProFormText
                name="imgFromWebHref"
                label="售后链接"
                tooltip="对应平台可查看的的售后的链接，作为截图的补充"
            />
            <ProFormTextArea
                name="reason"
                width="xl"
                label="售后原因" rules={[
                    {
                        required: true,
                        message: '请填写售后原因',
                    },
                ]} />

        </ModalForm>
    );
};

export default OperateProductAftermarket;
