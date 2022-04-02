const userResource = {
  encryptedPassword: {
    isVisible: false,
  },
  password: {
    type: "string",
    isVisible: {
      show: false,
      edit: true,
      list: false,
      filter: false,
    },
  },
};

module.exports = userResource;
