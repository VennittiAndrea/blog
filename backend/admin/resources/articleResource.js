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
      show: AdminJS.bundle("../components/upload-file.show.tsx"),
    },
  },
  uploadImage: {
    required: true,
    components: {
      edit: AdminJS.bundle("../components/upload-image.edit.tsx"),
      list: AdminJS.bundle("../components/upload-image.list.tsx"),
      show: AdminJS.bundle("../components/upload-image.show.tsx"),
    },
  },
  fileLocation: {isVisible: false,},
  imageLocation: {isVisible: false,},
  sanitizedHtml: {isVisible: false,},
  slug: {isVisible: false,},
  readingTime: {isVisible:{ edit: false, show: true, list: true, filter: true }},
  visuals: {isVisible:{ edit: false, show: true, list: true, filter: true }},
  modified: {isVisible: false,},
  createdAt: {isVisible:{ edit: false, show: true, list: true, filter: true }},
  updatedAt: {isVisible:{ edit: false, show: true, list: true, filter: true }},
  popCached: {isVisible: { edit: false, show: true, list: true, filter: true }},
  timeCached: {isVisible: false,},

};

module.exports = articleResource;
