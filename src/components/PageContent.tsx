import type { PropsWithChildren } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Card } from 'antd';

// eslint-disable-next-line @typescript-eslint/ban-types
export function PageContent(props: PropsWithChildren<{style?: React.CSSProperties }>) {
  const { children ,style} = props;
  return (
    <GridContent>
      <Card style={{ minHeight: '95vh' ,...style}}>{children}</Card>
    </GridContent>
  );
}
