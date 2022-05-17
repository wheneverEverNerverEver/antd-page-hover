import { ChangeWordUser } from "@/services/wood/api";
import type { ProFormInstance} from "@ant-design/pro-form";
import { ProFormText} from "@ant-design/pro-form";
import { ModalForm } from "@ant-design/pro-form";
import { Button, message } from "antd";
import { useRef } from "react";
const CryptoJS = require('crypto-js');

const PasswordChange: React.FC<{id?: string,refetch: () => void,accountName?: string}>=({id,refetch,accountName})=>{
  const formRef = useRef<ProFormInstance<{
    newWord?: string,
    newWordCheck?: string,
  }>>();

  return (
    <ModalForm
    formRef={formRef}
    modalProps={{
      destroyOnClose: true,
      maskClosable: false
    }}
    title={`正在修改用户[${accountName}]的密码`}
    trigger={
      <Button type="primary" style={{
        marginLeft: '20px'
      }}>
        修改密码
      </Button>
    }
    onVisibleChange={(ifShow) => {
      if (!ifShow) {
        formRef.current?.resetFields();
      }
    }}
    onFinish={async(valuesGot)=>{
      const { newWord, newWordCheck } = valuesGot;
      if(!id) {
        message.error('出现错误，请重试');
        return false;
      }
        if (newWord !== newWordCheck ) {
          message.error('两次输入的密码不一致，请重新输入');
          return false;
        }


          const encodeNewWord = CryptoJS.AES.encrypt(newWord, 'caikeluofusiji').toString();
          const back = await ChangeWordUser({
            newWord: encodeNewWord,
           id,
          });
          const backIfTrue=back?.error;
          message[backIfTrue?'error':'success'](`修改${backIfTrue?'失败':'成功'}`);
          refetch?.()
        return true;
    }}
     >
          <ProFormText.Password
              name="newWord"
              label="新密码"
              rules={[
                {
                  required: true,
                  message: '请输入新密码！',
                }, {
                  max: 30,
                  message: '请控制在30个字符以内'
                },{
                  min: 8,
                  message: '至少需要8位字符'
                }
              ]}
            />
            <ProFormText.Password
              name="newWordCheck"
              label="确认密码"
              rules={[
                {
                  required: true,
                  message: '请确认密码！',
                }, {
                  max: 30,
                  message: '请控制在30个字符以内'
                },{
                  min: 8,
                  message: '至少需要8位字符'
                }
              ]}
            />
       </ModalForm>
  )
}
export default PasswordChange
