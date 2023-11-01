import levels from "./levels/index.js";
import CustomRenderer from "./customRenderer.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, commonOptions } from "./constants.js";
const Bodies = Matter.Bodies,
  Composite = Matter.Composite;

const destroyableOptions = {
  ...commonOptions,
  isStatic: true,
  id: "destroyable",
  render: {
    fillStyle: "#DAFFFB",
    lineWidth: 1,
  },
};

const obstacleOptions = {
  ...commonOptions,
  isStatic: true,
  id: "obstacle",
  render: {
    fillStyle: "#04364A",
    lineWidth: 1,
  },
};

const borderOptions = {
  ...commonOptions,
  isStatic: true,
  id: "border",
  isSensor: true,
  render: {
    fillStyle: "transparent",
    lineWidth: 1,
  },
};

export const removeAllBodies = (engine, render) => {
  Composite.clear(engine.world, false);
  CustomRenderer.removeAllCustomLines(render);
  CustomRenderer.removeAllCustomTexts(render);
  document.getElementById("btn-restart").style.display = "none";
  document.getElementById("btn-start").style.display = "none";
};

export const addBodies = (levelNumber, engine) => {
  const bottomBorder = Bodies.rectangle(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    1,
    {
      ...borderOptions,
    }
  );
  const leftBorder = Bodies.rectangle(0, CANVAS_HEIGHT / 2, 1, CANVAS_HEIGHT, {
    ...borderOptions,
  });
  const rightBorder = Bodies.rectangle(
    CANVAS_WIDTH,
    CANVAS_HEIGHT / 2,
    1,
    CANVAS_HEIGHT,
    {
      ...borderOptions,
    }
  );
  const topBorder = Bodies.rectangle(CANVAS_WIDTH / 2, 0, CANVAS_WIDTH, 1, {
    ...borderOptions,
  });
  const bodies = [bottomBorder, leftBorder, rightBorder, topBorder];

  levels[levelNumber - 1].bodies.forEach((body) => {
    const { shape, x, y, type, angle } = body;
    let newBody = null;
    switch (shape) {
      case "custom":
        const { vertices } = body;
        newBody = Bodies.fromVertices(
          x,
          y,
          vertices,
          type === "obstacle" ? obstacleOptions : destroyableOptions
        );
        break;
      case "circle":
        const { radius } = body;
        newBody = Bodies.circle(
          x,
          y,
          radius,
          type === "obstacle" ? obstacleOptions : destroyableOptions
        );
        break;
      case "rectangle":
        const { width, height } = body;
        newBody = Bodies.rectangle(
          x,
          y,
          width,
          height,
          type === "obstacle" ? obstacleOptions : destroyableOptions
        );
        break;
      case "polygon":
        const { sides, radius: polygonRadius } = body;
        newBody = Bodies.polygon(
          x,
          y,
          sides,
          polygonRadius,
          type === "obstacle" ? obstacleOptions : destroyableOptions
        );
        break;
      case "trapezoid":
        const { width: trapezoidWidth, height: trapezoidHeight, slope } = body;
        newBody = Bodies.trapezoid(
          x,
          y,
          trapezoidWidth,
          trapezoidHeight,
          slope,
          type === "obstacle" ? obstacleOptions : destroyableOptions
        );
        break;
      default:
        break;
    }
    if (angle) {
      Matter.Body.rotate(newBody, angle);
    }
    bodies.push(newBody);
  });
  Composite.add(engine.world, bodies);
};
