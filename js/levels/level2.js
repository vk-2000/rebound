export default {
  bodies: [
    {
      id: "body1",
      shape: "custom",
      x: 400,
      y: 300,
      vertices: [
        { x: 0, y: 0 },
        { x: 20, y: 0 },
        { x: 20, y: 200 },
        { x: 0, y: 200 },
      ],
      type: "destroyable",
    },
    {
      id: "body2",
      shape: "circle",
      x: 600,
      y: 200,
      radius: 50,
      type: "destroyable",
    },
  ],
};
