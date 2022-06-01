import React, { useState } from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';
import { Button, Drawer, Table } from 'antd';
import { mingziduiying, productChoiceTypeObjDic } from '@/services/wood/dict';
import { findProductNewOneData } from '@/services/wood/api';

const DetailDrawer: React.FC<{
  type: API.ProductChoiceType | 'shixiang';
  idFrom?: string;
  name?: string;
}> = ({ type, idFrom, name }) => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<API.ProductNewType>();

  return (
    <>
      <Button
        type="text"
        color="primary"
        onClick={() => {
          findProductNewOneData({ id: idFrom }).then((res) => {
            setCurrentRow(res);
            setShowDetail(true);
          });
        }}
      >
        {name}
      </Button>
      {
        <Drawer
          width={600}
          visible={showDetail}
          onClose={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
          destroyOnClose
          closable={false}
        >
          {currentRow?.code && (
            <ProDescriptions<API.ProductNewType>
              column={1}
              title={currentRow?.[mingziduiying['名称'][type]]}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.code,
              }}
              columns={[
                {
                  title: '商品编码',
                  key: 'code',
                  dataIndex: 'code',
                },
                {
                  title: '有赞商品条码',
                  key: 'barCode',
                  dataIndex: 'barCode',
                  hide: type === 'shixiang',
                },
                {
                  title: `${productChoiceTypeObjDic[type]}名称`,
                  key: mingziduiying['名称'][type],
                  dataIndex: mingziduiying['名称'][type],
                },
                {
                  title: '管家婆名称',
                  key: 'gjname',
                  dataIndex: 'gjname',
                },
                {
                  title: `${type === 'shixiang' ? '食享' : '有赞'}规格`,
                  key: mingziduiying['规格'][type],
                  dataIndex: mingziduiying['规格'][type],
                },
                {
                  title: '管家婆规格',
                  key: 'gjspecifications',
                  dataIndex: 'gjspecifications',
                },
                {
                  title: '',
                  key: 'productDetail',
                  dataIndex: 'productDetail',
                  render: () => (
                    <Table
                      dataSource={currentRow?.productDetail}
                      pagination={false}
                      rowKey="_id"
                      columns={[
                        {
                          title: `${type === 'shixiang' ? '食享' : '有赞'}单位`,
                          dataIndex: mingziduiying['单位'][type],
                          key: mingziduiying['单位'][type],
                        },
                        {
                          title: '管家婆单位',
                          dataIndex: 'gjunit',
                          key: 'gjunit',
                        },
                        {
                          title: `${productChoiceTypeObjDic[type]}价格`,
                          dataIndex: mingziduiying['价格'][type],
                          key: mingziduiying['价格'][type],
                        },
                        {
                          title: '管家婆价格',
                          dataIndex: mingziduiying['管家价格'][type],
                          key: mingziduiying['管家价格'][type],
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />
          )}
        </Drawer>
      }
    </>
  );
};

export default DetailDrawer;
