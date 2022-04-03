import React from 'react';
import { BasePropertyProps } from 'adminjs';
import { Box } from '@adminjs/design-system';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props

  const srcFile = record.params['fileLocation']
  return (
    <Box>
      {srcFile ? (
        <a href={srcFile}>File</a>
      ) : 'problem with the file'}
    </Box>
  )
}

export default Edit