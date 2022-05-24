import { Row, Col, Typography } from 'antd';
import DepartmentSelect from './departmentSelect';

const OtherDepartment: React.FC = () => {
  return (
    <>
      <Typography
        style={{
          marginBottom: '15px',
        }}
      >
        需要根据路线设置<strong>另外的单据中部门字段</strong>
      </Typography>
      <Row
        gutter={24}
        style={{
          background: 'rgb(250 250 250)',
          padding: '15px 0',
          borderRadius: '5px',
        }}
      >
        <Col span={12}>
          <DepartmentSelect
            name="otherRouter"
            initialValue={["YWN32"]}
            type="DISTRICT"
            label="对应路线"
            mode="multiple"
          />
        </Col>
        <Col span={12}>
          <DepartmentSelect
            name="otherDepartment"
            initialValue="gzlk22"
            type="DEPARTENT"
            label="另外的部门（统计字段）"
          />
        </Col>
      </Row>
    </>
  );
};

export default OtherDepartment;
