export default {
  bodies: [
    {
      id: "body1",
      shape: "rectangle",
      x: 400,
      y: 100,
      height: 10,
      width: 100,
      type: "destroyable",
    },
    {
      id: "body2",
      shape: "rectangle",
      x: 400,
      y: 130,
      height: 10,
      width: 100,
      type: "destroyable",
    },
    {
      id: "body3",
      shape: "rectangle",
      x: 400,
      y: 160,
      height: 10,
      width: 100,
      type: "destroyable",
    },
    {
      id: "body4",
      shape: "rectangle",
      x: 400,
      y: 190,
      height: 10,
      width: 100,
      type: "destroyable",
    },

    {
      id: "body5",
      shape: "rectangle",
      x: 400 - 50,
      y: 300 + Math.sqrt(2) * 25,
      height: 100,
      width: 100,
      angle: Math.PI / 4,
      type: "obstacle",
    },
    {
      id: "body5",
      shape: "rectangle",
      x: 600 + 50,
      y: 300 - Math.sqrt(2) * 25,
      height: 100,
      width: 100,
      angle: Math.PI / 4,
      type: "obstacle",
    },

    {
      id: "body1",
      shape: "rectangle",
      x: 600,
      y: 410,
      height: 10,
      width: 100,
      type: "destroyable",
    },
    {
      id: "body2",
      shape: "rectangle",
      x: 600,
      y: 440,
      height: 10,
      width: 100,
      type: "destroyable",
    },
    {
      id: "body3",
      shape: "rectangle",
      x: 600,
      y: 470,
      height: 10,
      width: 100,
      type: "destroyable",
    },
    {
      id: "body4",
      shape: "rectangle",
      x: 600,
      y: 500,
      height: 10,
      width: 100,
      type: "destroyable",
    },
  ],
};
