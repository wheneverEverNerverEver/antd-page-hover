import ProForm, { ProFormList, ProFormSelect } from '@ant-design/pro-form';
import { Typography, Button } from 'antd';
import { useState } from 'react';
import { useFindDepartment } from './departmentSelect';

const OtherDepartment: React.FC = () => {
  const [needOther, setNeedOther] = useState(true);
  const departDIS = useFindDepartment('DISTRICT');
  const departSEP = useFindDepartment('DEPARTENT');
  return (
    <>
      <Typography
        style={{
          marginBottom: '15px',
        }}
      >
        <Button
          type="text"
          style={{
            color: '#1890ff',
            borderBottom: '3px solid #1890ff',
          }}
          onClick={() => {
            setNeedOther((v) => !v);
          }}
        >
          {needOther ? '不需要' : '需要'}
        </Button>
        根据路线设置<strong>另外的单据中部门字段</strong>
      </Typography>
      {needOther && (
        <div
          style={{
            background: 'rgb(250 250 250)',
            padding: '15px 30px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
          }}
        >
          <ProFormList
            name="other"
            creatorButtonProps={{
              position: 'bottom',
            }}
            initialValue={[
              { router: 'YWN32', department: 'gzlk22' },
              { router: 'YWN33', department: 'gzlk29' },
            ]}
          >
            <ProForm.Group key="base" direction="horizontal" size={[23, 23]} align="center">
              <ProFormSelect name="router" label="对应路线" options={departDIS} width="lg" />
              <ProFormSelect
                width="lg"
                name="department"
                label="另外的部门（统计字段）"
                options={departSEP}
              />
            </ProForm.Group>
          </ProFormList>
        </div>
      )}
    </>
  );
};

export default OtherDepartment;
