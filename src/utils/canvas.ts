export function isSupportBoundingBox(ctx: CanvasRenderingContext2D) {
  const measureText = ctx.measureText('田');
  return typeof measureText.actualBoundingBoxAscent === 'number';
}