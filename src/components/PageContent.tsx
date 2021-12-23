import type { PropsWithChildren } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Card } from 'antd';

export function PageContent(props: PropsWithChildren<{}>) {
  const { children } = props;
  return (
    <GridContent>
      <Card style={{ minHeight: '95vh' }}>{children}</Card>
    </GridContent>
  );
}
