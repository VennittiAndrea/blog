import React from 'react'
import { BasePropertyProps } from 'adminjs';
import { Label, Box, DropZone, DropZoneProps, DropZoneItem } from '@adminjs/design-system'

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, onChange, record } = props

  const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
    onChange(property.name, files[0])
  }

  const uploadedFile = record.params.fileLocation
  const fileToUpload = record.params[property.name]

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone validate={{mimeTypes: ['application/zip', 'application/x-zip-compressed', 'multipart/x-zip']}} onChange={handleDropZoneChange}/>
      {uploadedFile && !fileToUpload && (
        <DropZoneItem src={uploadedFile} />
      )}
    </Box>
  )
}

export default Edit