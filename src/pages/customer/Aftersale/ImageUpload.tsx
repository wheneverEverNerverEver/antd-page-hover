import React, { useRef } from 'react';
import { Button, message } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import { importAfterImgData } from '@/services/wood/api';

type FileForm = {
    img: any[];

};

const wayWord = {
    imgRefund: '处理截图',
    deliveryImg: '进库图片'
}

const ImageUpload: React.FC<{
    refetch?: () => void,
    id?: string
    way?: 'imgRefund' | 'deliveryImg'
}> = (props) => {
    const { refetch, id, way } = props;
    const formRef = useRef<ProFormInstance<FileForm>>();
    return (
        <ModalForm<FileForm>
            modalProps={{
                destroyOnClose: true,
                maskClosable: false
            }}
            formRef={formRef}
            title={`上传${wayWord[way || 'imgRefund']}`}
            trigger={
                <Button type="primary" className="green-btn">
                    {`上传${wayWord[way || 'imgRefund']}`}
                </Button>
            }
            onVisibleChange={(ifShow) => {
                if (!ifShow) {
                    formRef.current?.resetFields();
                }
            }}
            onFinish={async (values) => {
                const file = values.img?.[0]?.originFileObj;
                if (!file || !id) {
                    message.error('请选择要上传的图片');
                    return false;
                }
                const up = await importAfterImgData({ file }, id, way!);


                message[up?.error ? 'error' : 'success'](up?.error ? '图片上传失败' : '图片上传成功');
                refetch?.();
                return true;
            }}
        >
            <ProFormUploadDragger
                max={1}
                label="选择上传图片"
                placeholder="——"
                name="img"
                accept="image/png,image/jpg,image/jpeg"
                fieldProps={{
                  beforeUpload: () => false
                }}
            />

        </ModalForm>
    );
};

export default ImageUpload;
