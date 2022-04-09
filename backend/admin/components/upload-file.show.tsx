import React from 'react';
import { BasePropertyProps } from 'adminjs';
import { Box, Text } from '@adminjs/design-system';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props

  const srcFile = record.params['fileLocation']
  return (
    <Box marginTop={10} marginBottom={10}>
      <Text variant="sm" color="gray"> Uploaded Image </Text>
      <Box>
      {srcFile ? (
        <a href={srcFile}>{srcFile}</a>
      ) : 'problem with the file'}
    </Box>
  </Box>
  )
}

export default Edit