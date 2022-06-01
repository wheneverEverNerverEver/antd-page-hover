/* eslint-disable no-underscore-dangle */
import React, { useMemo, useRef, useState } from 'react';
import { Button, message, Typography } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, { ProFormText, ModalForm, ProFormList } from '@ant-design/pro-form';
import { PlusOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  updateProductNewData,
  addProductNewData,
  findProductNewOneData,
} from '@/services/wood/api';
import type { ActionType } from '@ant-design/pro-table';
import { mingziduiying, typeDict } from '@/services/wood/dict';

type UpdateFormProps = API.UpdateFormProps<API.ProductNewType> & {
  id?: string;
  productType: API.ProductChoiceType | 'shixiang';
  refetchTableRef?: React.MutableRefObject<ActionType | undefined>;
};

const OperateProduct: React.FC<UpdateFormProps> = (props) => {
  const { type, id, refetchTableRef, productType } = props;
  const formRef = useRef<ProFormInstance<API.ProductNewType>>();
  const [values, setValue] = useState<API.ProductNewType>();
  const [visible, setVisible] = useState<boolean>();

  const codeName = useMemo(
    () => (productType === 'shixiang' ? '共同' : '管家婆编码'),
    [productType],
  );
  const proFromName = useMemo(() => (productType === 'shixiang' ? '食享' : '有赞'), [productType]);
  const anthoerUnit = useMemo(() => mingziduiying['单位'][productType], [productType]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          if (type === 'UPDATE') {
            findProductNewOneData({ id }).then((res) => {
              if (res?._id) {
                setValue(res);
                setVisible(true);
              }
            });
          } else {
            setValue({});
            setVisible(true);
          }
        }}
      >
        {type === 'ADD' ? <PlusOutlined /> : <EditOutlined />}
        {`${typeDict[type]}`}
      </Button>
      {visible && (
        <ModalForm<API.ProductNewType>
          modalProps={{
            destroyOnClose: true,
            maskClosable: false,
            keyboard: false,
          }}
          title={`${typeDict[type]}商品`}
          formRef={formRef}
          visible={visible}
          initialValues={values}
          onVisibleChange={(ifShow) => {
            if (!ifShow) {
              formRef.current?.resetFields();
              setVisible(false);
            }
          }}
          onFinish={async (valuesGot) => {
            let back: API.ProductNewType | API.ErrorDe;
            const { productDetail = [] } = valuesGot;
            const tempObj = {};
            // 判断管家婆单位不相等
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < productDetail.length; i++) {
              const unitGj = productDetail[i]?.gjunit;
              if (unitGj) {
                if (!tempObj[unitGj]) {
                  tempObj[unitGj] = true;
                } else {
                  message.error('管家婆的单位请不要重复');
                  return false;
                }
              }
            }

            try {
              if (type === 'ADD') {
                back = await addProductNewData({ ...valuesGot });
                if (!(back as API.ErrorDe)?.error) {
                  message.success(`${typeDict[type]}成功`);
                  refetchTableRef?.current?.reload();
                  return true;
                }
              }
              if (type === 'UPDATE' && values?._id) {
                back = await updateProductNewData({ ...valuesGot, _id: values._id });
                if (!(back as API.ErrorDe)?.error) {
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
          <ProForm.Group>
            <ProFormText
              name="code"
              label={codeName}
              rules={[
                {
                  required: true,
                  message: `请填入${codeName}`,
                },
              ]}
            />
            {productType !== 'shixiang' && (
              <ProFormText
                width="md"
                name="barCode"
                label="有赞商品条码"
                rules={[
                  {
                    required: true,
                    message: '请填入商品条码',
                  },
                ]}
              />
            )}
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              width="md"
              name={mingziduiying['名称'][productType]}
              label={`${proFromName}名称`}
              rules={[
                {
                  required: true,
                  message: `请输入${proFromName}名称！`,
                },
              ]}
            />
            <ProFormText
              width="md"
              name="gjname"
              label="管家婆名称"
              rules={[
                {
                  required: true,
                  message: '请输入管家婆名称！',
                },
              ]}
            />
          </ProForm.Group>

          <ProForm.Group>
            <ProFormText
              width="md"
              name={mingziduiying['规格'][productType]}
              label={`${proFromName}规格`}
            />
            <ProFormText width="md" name="gjspecifications" label="管家婆规格" />
          </ProForm.Group>
          <ProFormList
            name="productDetail"
            label={
              <>
                单位对应
                <ExclamationCircleOutlined
                  twoToneColor="#52c41a"
                  style={{ margin: '0 5px 0 15px' }}
                />
                <Typography.Text type="warning">请确认单位的对应是正确的！</Typography.Text>
              </>
            }
            creatorButtonProps={{
              position: 'bottom',
            }}
            initialValue={
              type === 'ADD'
                ? [
                    { [anthoerUnit]: '包', gjunit: '包' },
                    { [anthoerUnit]: '箱', gjunit: '箱' },
                  ]
                : undefined
            }
          >
            <ProForm.Group key="base">
              <ProFormText name={anthoerUnit} label={`${proFromName}单位`} />
              <ProFormText name="gjunit" label="管家婆对应单位" />
            </ProForm.Group>
          </ProFormList>
        </ModalForm>
      )}
    </>
  );
};

export default OperateProduct;
