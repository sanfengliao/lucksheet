class LineRenderer {
  constructor(ctx) {
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;
  }

  render({
    start,
    end,
    style,
    width,
  }) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = width;
    ctx.strokeStyle = style;
    ctx.stroke();
    ctx.closePath();
  }
}

export default LineRenderer;