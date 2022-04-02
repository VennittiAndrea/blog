const AdminJS = require('adminjs');

//qui in realtà devo andare a mettere diverse trasformazioni
//direi che mi conviene andarle a mettere su mongodb
const articleResource = {
  ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } },
  content: {
    type: "richtext",
    custom: {
      modules: {
        toolbar: [
          ["bold", "italic"],
          ["link", "image"],
        ],
      },
    },
  },
  uploadImage: {
    components: {
      edit: AdminJS.bundle("../components/upload-image.edit.tsx"),
      list: AdminJS.bundle("../components/upload-image.list.tsx"),
    },
  },
};

module.exports = articleResource;
