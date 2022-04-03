import React from 'react'
import { BasePropertyProps } from 'adminjs';
import { Label, Box, DropZone, DropZoneProps, DropZoneItem } from '@adminjs/design-system'

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, onChange, record } = props

  const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
    onChange(property.name, files[0])
  }

  const uploadedImage = record.params.imageLocation
  const imageToUpload = record.params[property.name]

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone validate={{mimeTypes: ['image/png', 'image/jpg']}} onChange={handleDropZoneChange}/>
      {uploadedImage && !imageToUpload && (
        <DropZoneItem src={uploadedImage} />
      )}
    </Box>
  )
}

export default Edit