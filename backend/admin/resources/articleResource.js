const AdminJS = require('adminjs');

//qui in realtà devo andare a mettere diverse trasformazioni
//direi che mi conviene andarle a mettere su mongodb
const articleResource = {
  ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } },
  // content: {
  //   type: "richtext",
  //   custom: {
  //     modules: {
  //       toolbar: [
  //         ["bold", "italic"],
  //         ["link", "image"],
  //       ],
  //     },
  //   },
  // },
  uploadFile: {
    required: true,
    components: {
      edit: AdminJS.bundle("../components/upload-file.edit.tsx"),
      list: AdminJS.bundle("../components/upload-file.list.tsx"),
    },
  },
  uploadImage: {
    required: true,
    components: {
      edit: AdminJS.bundle("../components/upload-image.edit.tsx"),
      list: AdminJS.bundle("../components/upload-image.list.tsx"),
    },
  },
  sanitizedHtml: {isVisible: false,},
  slug: {isVisible: false,},
  fileLocation: {isVisible: false,},
  imageLocation: {isVisible: false,},
  ownerId: { isVisible: { edit: true, show: true, list: true, filter: true } },
};

module.exports = articleResource;
