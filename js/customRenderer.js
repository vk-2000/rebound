const Render = Matter.Render,
  Composite = Matter.Composite,
  Body = Matter.Body;

const CustomRenderer = {
  create: (options) => {
    const render = Render.create(options);
    render.customShapes = [];
    render.customTexts = [];
    render.customLines = [];

    render.drawBodies = (ctx) => {
      const { engine } = render;
      const bodies = Composite.allBodies(engine.world);
      bodies.forEach((body) => {
        ctx.beginPath();
        const { vertices, label, id } = body;
        const { fillStyle, strokeStyle, lineWidth } = body.render;
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle || fillStyle;
        ctx.lineWidth = lineWidth;

        if (id === "destroyable") {
          ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
        }

        if (label === "Circle Body") {
          const { area } = body;
          const radius = Math.sqrt(area / Math.PI);
          for (let i = 0; i < vertices.length - 1; i += 1) {
            ctx.arcTo(
              vertices[i].x,
              vertices[i].y,
              vertices[i + 1].x,
              vertices[i + 1].y,
              radius
            );
          }
          ctx.arcTo(
            vertices[vertices.length - 1].x,
            vertices[vertices.length - 1].y,
            vertices[0].x,
            vertices[0].y,
            radius
          );
        } else {
          vertices.forEach((vertex, i) => {
            if (i === 0) {
              ctx.moveTo(vertex.x, vertex.y);
            } else {
              ctx.lineTo(vertex.x, vertex.y);
            }
          });
          ctx.lineTo(vertices[0].x, vertices[0].y);
        }
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        // ctx.stroke();
      });
    };

    render.drawCustomTexts = (ctx) => {
      render.customTexts.forEach((text) => {
        ctx.fillStyle = text.color;
        ctx.font = `${text.fontSize} ${text.fontFamily}`;
        ctx.fillText(text.text, text.x, text.y);
      });
    };

    render.drawCustomLines = (ctx) => {
      render.customLines.forEach((line) => {
        ctx.strokeStyle = "#04364A";
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    };

    return render;
  },

  addCustomText: (render, x, y, text, fontSize, fontFamily, color) => {
    render.customTexts.push({
      x,
      y,
      text,
      fontSize,
      fontFamily,
      color,
    });
  },

  removeAllCustomTexts: (render) => {
    render.customTexts = [];
  },

  addCustomLine: (render, x1, y1, x2, y2) => {
    render.customLines.push({
      x1,
      y1,
      x2,
      y2,
    });
  },

  removeAllCustomLines: (render) => {
    render.customLines = [];
  },

  explodeBody: (render, body) => {
    body.isSensor = true;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      Body.scale(body, 1.05, 1.05);
      if (progress > 100) {
        Composite.remove(render.engine.world, body);
      } else {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  },

  run: (render) => {
    (function rerender() {
      const { canvas } = render;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      render.drawBodies(context);
      render.drawCustomLines(context);
      render.drawCustomTexts(context);

      requestAnimationFrame(rerender);
    })();
  },
};

export default CustomRenderer;
