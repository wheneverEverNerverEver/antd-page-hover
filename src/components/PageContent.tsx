import type { PropsWithChildren } from 'react';
import {  PageContainer } from '@ant-design/pro-layout';
import type { CardProps } from 'antd';
import { Card } from 'antd';

// eslint-disable-next-line @typescript-eslint/ban-types
export function PageContent(props: PropsWithChildren<{style?: React.CSSProperties ,cardProps?: CardProps}>) {
  const { children ,style} = props;
  return (
    <PageContainer>
      <Card style={{ minHeight: '95vh' ,...style}} >{children}</Card>
    </PageContainer>
  );
}
