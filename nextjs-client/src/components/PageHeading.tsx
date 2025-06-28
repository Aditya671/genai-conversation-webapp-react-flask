import { Typography } from 'antd';
import React from 'react';

interface PageHeadingProps {
  headingText?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5;
  [key: string]: unknown;
}

export const PageHeading: React.FC<PageHeadingProps> = ({ headingText = '', headingLevel = 3, ...rest }) => {
  return (
    <Typography.Title
      className='theme-heading-font'
      style={{
        color: '#f1f1f1', fontWeight: 700,
        marginTop: 0, marginBottom: 2,
        padding: '0 10px'
      }}
      {...rest}
      level={headingLevel}
    >
      {headingText}
    </Typography.Title>
  );
};
