import React from "react";
import { BasePropertyProps } from "adminjs";
import { Box, Text } from "@adminjs/design-system";

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;

  const srcImg = record.params["imageLocation"];
  return (
    <Box marginTop={10} marginBottom={10}>
      <Text variant="sm" color="gray"> Uploaded Image </Text>
      <Box>
        {srcImg ? <img src={srcImg} width="100" /> : "problem with the image"}
      </Box>
    </Box>
  );
};

export default Edit;
