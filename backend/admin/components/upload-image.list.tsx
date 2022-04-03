import React from 'react';
import { BasePropertyProps } from 'adminjs';
import { Box } from '@adminjs/design-system';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props

  const srcImg = record.params['imageLocation']
  return (
    <Box>
      {srcImg ? (
        <img src={srcImg} width='100'/>
      ) : 'problem with the image'}
    </Box>
  )
}

export default Edit