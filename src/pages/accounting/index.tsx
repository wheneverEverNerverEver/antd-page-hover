/* eslint-disable no-underscore-dangle */
import { message, Popconfirm, Button } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findCustomerData, deleteCustomerData } from '@/services/wood/api';




const AccountingList: React.FC = () => {
    /**
     * @en-US Pop-up window of new window
     * @zh-CN 新建窗口的弹窗
     *  */
    /**
     * @en-US The pop-up window of the distribution update window
     * @zh-CN 分布更新窗口的弹窗
     * */

    const actionRef = useRef<ActionType>();

    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */

    const columns: ProColumns<API.CustomerType>[] = [
        {
            title: '三方用户ID规则',
            dataIndex: 'withStart',
            tip: '目前只支持以什么三方用户ID为开头的规则',
        },
        {
            title: '部门（统计字段）',
            dataIndex: 'deCodeName',
            valueType: 'text',
        },
        {
            title: '操作',
            dataIndex: 'action',
            valueType: 'option',
            render: (_, record) => [
                <Popconfirm
                    title="你确定要删除该规则吗？"
                    onConfirm={async () => {
                        if (record._id) {
                            const result = await deleteCustomerData({ id: record._id });
                            if (!(result as API.ErrorDe)?.error) {
                                actionRef?.current?.reload();
                                message.success('删除成功');
                            } else {
                                message.error('删除失败');
                            }
                        }
                    }}
                    onCancel={() => { }}
                    okText="确定"
                    cancelText="否"
                >
                    <Button type="primary" danger>
                        删除
                    </Button>
                </Popconfirm>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.CustomerType, Record<any, string>>
                actionRef={actionRef}
                rowKey="_id"
                search={false}
                request={async (params) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    const { current, pageSize, ...rest } = params;
                    return findCustomerData({
                        limit: pageSize,
                        page: current,
                        ...rest,
                    });
                }}
                options={false}
                toolBarRender={() => [
                    <>导入</>
                ]}
                columns={columns}
                pagination={{
                    pageSizeOptions: ['10'],
                }}
            />

        </PageContainer>
    );
};


export default AccountingList