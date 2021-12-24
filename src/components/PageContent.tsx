import type { PropsWithChildren } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Card } from 'antd';

// eslint-disable-next-line @typescript-eslint/ban-types
export function PageContent(props: PropsWithChildren<{}>) {
  const { children } = props;
  return (
    <GridContent>
      <Card style={{ minHeight: '95vh' }}>{children}</Card>
    </GridContent>
  );
}
