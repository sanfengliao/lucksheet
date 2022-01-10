import Store from '../store';
import CellStatus from './cell-status';
import { isInlineStringCell } from '../controllers/inlineString';
import { luckysheetfontformat } from '../utils/util';
import { isRealNull, hasChinaword } from '../global/validate';
import { getTextSize } from '../utils/text';
import NormalTextCellTransformer  from '../transformer/normal-text-cell-transformer';
import InlineTextCellTransformer from 'src/transformer/inline-text-cell-transformer';
import NormalWrapTextCellTransformer from 'src/transformer/normal-wrap-text-cell-transformer';

/**
 * @param {import('@/typings').Cell} cell
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('@/typings').CellTextInfoOption} options;
 */
function getCellTextInfo(cell, ctx, options) {
  const { cellWidth } = options;
  const { cellHeight } = options;
  let mode = '';
  // console.log("initialinfo", cell, option);
  if (!cellWidth) {
    mode = 'onlyWidth';
  }

 
  const cellStatus = new CellStatus(cell);
 
  const textBreak = cellStatus.getTextBreak();


  ctx.textAlign = 'start';

  const textContent = {};
  textContent.values = [];

  let fontset;
  let underLine = 0;
  let fontSize = 11;
  let isInline = false;
  let value;
  let cancelLine = 0;
  if (isInlineStringCell(cell)) {
    return new InlineTextCellTransformer(cell, ctx, options).transform();
  } 

  fontset = luckysheetfontformat(cell);
  ctx.font = fontset;
  underLine = cellStatus.get('un');// underLine
  cancelLine = cellStatus.get('cl');
  fontSize = cellStatus.getFontSize();
  value = cell.m || cell.v || cell;
  if (isRealNull(value)) {
    return null;
  }

  const isSupportBoundBox = isSupportBoundingBox(ctx);
  if (isSupportBoundBox) {
    ctx.textBaseline = 'alphabetic';
  } else {
    ctx.textBaseline = 'bottom';
  }

  if (textBreak === 2 || isInline) { // wrap
    return new NormalWrapTextCellTransformer(cell, ctx, options).transform()
  } else {
    return new NormalTextCellTransformer(cell, ctx, options).transform();
  }

}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @returns
 */
function isSupportBoundingBox(ctx) {
  const measureText = ctx.measureText('田');
  return typeof measureText.actualBoundingBoxAscent === 'number';
}
export {
  getCellTextInfo,
};
