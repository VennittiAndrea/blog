//qui in realtà devo andare a mettere diverse trasformazioni
//direi che mi conviene andarle a mettere su mongodb
const article = {
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
};

module.exports = article;
