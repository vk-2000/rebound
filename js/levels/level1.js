export default {
  bodies: [
    {
      id: "body1",
      shape: "rectangle",
      x: 400,
      y: 300,
      height: 200,
      width: 20,
      type: "destroyable",
    },
    {
      id: "body2",
      shape: "custom",
      x: 600,
      y: 300,
      vertices: [
        { x: 0, y: 0 },
        { x: 20, y: 0 },
        { x: 20, y: 200 },
        { x: 0, y: 200 },
      ],
      type: "destroyable",
    },
  ],
};
