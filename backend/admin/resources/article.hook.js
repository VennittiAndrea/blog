const AdminJS = require("adminjs");
const path = require('path');
const fs = require('fs');

/** @type {AdminJS.After<AdminJS.ActionResponse>} */
const after = async (response, request, context) => {
  //image management
  const { record, uploadFile, uploadImage } = context;

  if (record.isValid() && uploadFile) {
    const filePath = path.join('uploads', record.id().toString(), uploadFile.name);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await fs.promises.rename(uploadFile.path, filePath);

    await record.update({ fileLocation: `/${filePath}` });
  }

  if (record.isValid() && uploadImage) {
    const filePath = path.join('uploads', record.id().toString(), uploadImage.name);
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    await fs.promises.rename(uploadImage.path, filePath);

    await record.update({ imageLocation: `/${filePath}` });
  }

  return response;
};

/** @type {AdminJS.Before} */
const before = async (request, context) => {
  if (request.method === "post") {
    //insert the currentAdmin
    request.payload = {
      ...request.payload,
      ownerId: context.currentAdmin._id,
    };

    //image management
    const { uploadFile, uploadImage, ...otherParams } = request.payload;

    // eslint-disable-next-line no-param-reassign
    context.uploadFile = uploadFile;
    context.uploadImage = uploadImage;

    return {
      ...request,
      payload: otherParams,
    };;
  }
  return request;
};

module.exports = { after, before };
