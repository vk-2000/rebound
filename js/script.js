const Engine = Matter.Engine,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Events = Matter.Events;

import { addBodies, removeAllBodies } from "./bodies.js";
import CustomRenderer from "./customRenderer.js";
import levels from "./levels/index.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, commonOptions } from "./constants.js";

const canvas = document.getElementById("canvas");
let mouseDownPosition = { x: 0, y: 0 };
let isDragging = false;
let currentLevel = localStorage.getItem("maxLevelNumber") || 1;
let onStartScreen = true;

let engine = null;
let render = null;

const handleMouseDown = (e) => {
  if (onStartScreen) {
    return;
  }
  if (Composite.allBodies(engine.world).find((body) => body.id === "ball")) {
    isDragging = false;
    refreshLevelScreen(currentLevel);
  }
  mouseDownPosition = {
    x: e.clientX - canvas.getBoundingClientRect().left,
    y: e.clientY - canvas.getBoundingClientRect().top,
  };
  isDragging = true;
};
const handleMouseUp = (e) => {
  if (!isDragging || onStartScreen) {
    return;
  }
  if (Composite.allBodies(engine.world).find((body) => body.id === "ball")) {
    isDragging = false;
    return;
  }
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;
  if (x === mouseDownPosition.x && y === mouseDownPosition.y) {
    isDragging = false;
    return;
  }
  // check if any body is overlapped with the mouseDownPosition
  const overlappedBodies = Matter.Query.point(
    Composite.allBodies(engine.world),
    mouseDownPosition
  );
  if (overlappedBodies.length > 0) {
    isDragging = false;
    CustomRenderer.removeAllCustomLines(render);
    return;
  }

  const dx = x - mouseDownPosition.x;
  const dy = y - mouseDownPosition.y;
  const newSphere = Bodies.circle(mouseDownPosition.x, mouseDownPosition.y, 5, {
    ...commonOptions,
    id: "ball",
    render: {
      fillStyle: "#04364A",
      strokeStyle: "#04364A",
      lineWidth: 1,
    },
  });
  const normalisedVelocity = Matter.Vector.normalise({ x: dx, y: dy });
  Matter.Body.setVelocity(newSphere, {
    x: normalisedVelocity.x * -8,
    y: normalisedVelocity.y * -8,
  });
  Composite.add(engine.world, [newSphere]);
  isDragging = false;
  CustomRenderer.removeAllCustomLines(render);
};
const handleMouseMove = (e) => {
  if (!isDragging || onStartScreen) {
    return;
  }
  if (Composite.allBodies(engine.world).find((body) => body.id === "ball")) {
    isDragging = false;
    return;
  }
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;
  if (isDragging) {
    CustomRenderer.removeAllCustomLines(render);
    CustomRenderer.addCustomLine(
      render,
      mouseDownPosition.x,
      mouseDownPosition.y,
      x,
      y
    );
  }
};
const handleMouseLeave = (e) => {
  if (onStartScreen) {
    return;
  }
  if (isDragging) {
    handleMouseUp(e);
  }
};

const loadEndScreen = () => {
  removeAllBodies(engine, render);
  CustomRenderer.addCustomText(
    render,
    CANVAS_WIDTH / 2 - 360,
    CANVAS_HEIGHT / 2 - 100,
    "Game Completed!",
    "80px",
    "Black Ops One",
    "#DAFFFB"
  );
  const restartButton = document.getElementById("btn-restart");
  restartButton.style.display = "block";
};

const refreshLevelScreen = (levelNumber) => {
  removeAllBodies(engine, render);
  if (levelNumber > levels.length) {
    loadEndScreen();
    return;
  }
  CustomRenderer.addCustomText(
    render,
    20,
    30,
    `Level ${levelNumber}`,
    "20px",
    "Black Ops One",
    "#DAFFFB"
  );

  addBodies(levelNumber, engine);
};

const loadStartScreen = () => {
  removeAllBodies(engine, render);
  CustomRenderer.addCustomText(
    render,
    CANVAS_WIDTH / 2 - 200,
    CANVAS_HEIGHT / 2 - 100,
    "REBOUND",
    "80px",
    "Black Ops One",
    "#DAFFFB"
  );
  const startButton = document.getElementById("btn-start");
  startButton.style.display = "block";
};

const setupModal = () => {
  const modalContainer = document.getElementById("modal-container");
  const modalOpenButton = document.getElementById("modal-open-btn");
  const levelsContainer = document.getElementById("levels-container");
  modalOpenButton.addEventListener("click", () => {
    modalContainer.classList.add("is-visible");
    modalContainer.classList.remove("is-hidden");
  });

  const modalCloseButton = document.getElementById("modal-close-btn");
  modalCloseButton.addEventListener("click", () => {
    modalContainer.classList.remove("is-visible");
    modalContainer.classList.add("is-hidden");
  });

  const maxLevelNumber =
    Number.parseInt(localStorage.getItem("maxLevelNumber")) || 1;
  levels.forEach((level, index) => {
    const levelButton = document.createElement("button");
    levelButton.classList.add("level-btn");
    if (index + 1 > maxLevelNumber) {
      levelButton.setAttribute("disabled", true);
      levelButton.classList.add("disabled");
    }
    levelButton.innerText = index + 1;
    levelButton.addEventListener("click", () => {
      modalContainer.classList.remove("is-visible");
      modalContainer.classList.add("is-hidden");
      loadLevel(index + 1);
    });
    levelsContainer.appendChild(levelButton);
  });
};

const updateLevelsInModal = (maxLevelNumber) => {
  const levelsContainer = document.getElementById("levels-container");
  levels.forEach((level, index) => {
    const levelButton = levelsContainer.children[index];
    if (index + 1 > maxLevelNumber) {
      levelButton.setAttribute("disabled", true);
      levelButton.classList.add("disabled");
    } else {
      levelButton.removeAttribute("disabled");
      levelButton.classList.remove("disabled");
    }
  });
};

const loadLevel = (levelNumber) => {
  currentLevel = levelNumber;
  // set maxLevelNumber in localStorage to the max of current maxLevelNumber and levelNumber
  const maxLevelNumber = Math.max(
    Number.parseInt(localStorage.getItem("maxLevelNumber")) || 1,
    levelNumber
  );
  localStorage.setItem("maxLevelNumber", maxLevelNumber);
  updateLevelsInModal(maxLevelNumber);
  refreshLevelScreen(levelNumber);
};

const init = () => {
  engine = Engine.create();
  const ctx = canvas.getContext("2d");

  render = CustomRenderer.create({
    canvas,
    engine,
    options: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    },
  });

  engine.gravity = { x: 0, y: 0 };
  Runner.run(engine);

  CustomRenderer.run(render);

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", handleMouseLeave);

  const maxLevelNumber =
    Number.parseInt(localStorage.getItem("maxLevelNumber")) || 1;

  Events.on(engine, "collisionEnd", (event) => {
    const { pairs } = event;
    pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;
      if (bodyA.id === "destroyable") {
        CustomRenderer.explodeBody(render, bodyA);
      }
      if (bodyB.id === "destroyable") {
        CustomRenderer.explodeBody(render, bodyB);
      }
      if (bodyA.id === "border" || bodyB.id === "border") {
        const remainingDestroyableBodies = Composite.allBodies(
          engine.world
        ).filter((body) => body.id === "destroyable");
        if (remainingDestroyableBodies.length !== 0) {
          refreshLevelScreen(currentLevel);
        }
      }
      if (
        Composite.allBodies(engine.world).filter(
          (body) => body.id === "destroyable"
        ).length === 0
      ) {
        // remove all borders to prevent triggering of collisionEnd event before the level is loaded
        Composite.remove(
          engine.world,
          Composite.allBodies(engine.world).filter(
            (body) => body.id === "border"
          )
        );
        setTimeout(() => {
          loadLevel(currentLevel + 1);
        }, 1000);
      }
    });
  });

  const startButton = document.getElementById("btn-start");
  startButton.addEventListener("click", () => {
    if (maxLevelNumber > levels.length) {
      loadLevel(levels.length);
    } else {
      loadLevel(maxLevelNumber);
    }
    onStartScreen = false;
  });

  const restartButton = document.getElementById("btn-restart");
  restartButton.addEventListener("click", () => {
    localStorage.setItem("maxLevelNumber", 1);
    updateLevelsInModal(1);
    loadLevel(1);
  });

  setupModal();

  loadStartScreen();
};

init();
