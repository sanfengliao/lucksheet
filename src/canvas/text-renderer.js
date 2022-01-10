class TextRenderer {
  constructor(ctx, lineRenderer) {
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    /**
     * @type {LineRenderer}
     */
    this.lineRenderer = lineRenderer;
  }

  /**
   *
   * @param {import('src/typings').RenderTextCell} textInfo
   * @param {import('@/typings').DrawTextOptions} options
   */
  render(textInfo, options) {
    if (textInfo === null) {
      return;
    }
    console.log(textInfo.rotate);
    const { values } = textInfo;
    if (values === null) {
      return;
    }
    const { ctx } = this;
    const { posX, posY } = options;
    ctx.save();
    ctx.translate(posX + textInfo.textLeftAll, posY + textInfo.textTopAll);
    
    textInfo.values.forEach((word) => {
      if (word.inline && word.style) {
        ctx.font = word.style.fontset;
        ctx.fillStyle = word.style.fc;
      } else {
        ctx.font = word.style;
      }
      const text = typeof word.content === 'object' ? word.content.m : word.content;
      ctx.fillText(text, word.left, word.top);
      const { cancelLine, underLine } = word;
      if (cancelLine) {
        const {
          startX, startY, endX, endY, fs,
        } = cancelLine;
        this.lineRenderer.render({
          start: {
            x: startX + 0.5,
            y: startY + 0.5,
          },
          end: {
            x: endX + 0.5,
            y: endY + 0.5,
          },
          width: Math.floor(fs / 9),
          style: ctx.fillStyle,
        });
      }
      if (underLine && underLine.length) {
        underLine.forEach((line) => {
          const {
            startX, startY, endX, endY, fs,
          } = line;
          this.lineRenderer.render({
            start: {
              x: startX + 0.5,
              y: startY + 0.5,
            },
            end: {
              x: endX + 0.5,
              y: endY + 0.5,
            },
            width: Math.floor(fs / 9),
            style: ctx.fillStyle,
          });
        });
      }
    });
    ctx.restore();
  }
}

export default TextRenderer;
