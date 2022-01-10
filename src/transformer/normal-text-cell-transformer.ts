import { HorizontalType, RenderTextCell, RenderTextCellValue, UnderlineType, VerticalType } from "../typings";
import { TextDecorateParams, getCancelLine, getUnderLine, getMeasureText } from "../utils/text";
import TextCellTransformer from "./text-cell-transformer";

export default class NormalTextCellTransformer extends TextCellTransformer {
  transform() {
    const { ctx } = this;
    const { options } = this;
    const {
      spaceWidth = 2,
      spaceHeight = 2,
      cellHeight,
      cellWidth,
    } = options;
    const {
      horizontalType,
      verticalType,
      rotateAngle: r,
      value,
      fontset,
      cancelLine,
      underLine,
      fontSize
    } = this.baseInfo;
    const renderTextCell = { } as RenderTextCell;
    renderTextCell.values = [];

    ctx.textBaseline = 'alphabetic';

    const measureText = getMeasureText(ctx, value);
    const textWidth = measureText.width;
    const textHeight = measureText.actualBoundingBoxDescent + measureText.actualBoundingBoxAscent;

    // 如果字体旋转， 计算字体占用的宽高
    renderTextCell.textWidthAll = textWidth;
   
    renderTextCell.textHeightAll = textHeight;

    const width = textWidth;
    const height = textHeight;

    // 计算出旋转之后偏移的距离
    let left = spaceWidth ; // 默认为1，左对齐
    if (horizontalType === HorizontalType.Middle) { // 居中对齐
      left = cellWidth / 2 - width / 2;
    } else if (horizontalType === HorizontalType.Right) { // 右对齐
      left = cellWidth - spaceWidth - width;
    }

    // 默认为2，下对齐
    let top = (cellHeight - spaceHeight) - measureText.actualBoundingBoxDescent;
    if (verticalType === VerticalType.Middle) {
      // 居中对齐
      top = cellHeight / 2 - height / 2 + measureText.actualBoundingBoxAscent;
    } else if (verticalType === VerticalType.Top) {
      // 上对齐
      top = spaceHeight + measureText.actualBoundingBoxAscent;
    }

    renderTextCell.type = 'plain';
    renderTextCell.textLeftAll = left;
    renderTextCell.textTopAll = top;

    const wordGroup = {
      content: value,
      style: fontset,
      width,
      height,
      left: 0,
      top: 0,
    } as RenderTextCellValue;

    const decorateParam: TextDecorateParams = {
      width: textWidth,
      left: wordGroup.left,
      top: wordGroup.top,
      asc: measureText.actualBoundingBoxAscent,
      desc: measureText.actualBoundingBoxDescent,
      fontSize,
    }
    if (cancelLine) {
      wordGroup.cancelLine = getCancelLine(decorateParam)
    }
    wordGroup.underLine = getUnderLine(underLine as UnderlineType, decorateParam);

    renderTextCell.values.push(wordGroup);

    renderTextCell.textLeftAll = left;
    renderTextCell.textTopAll = top;

    renderTextCell.asc = measureText.actualBoundingBoxAscent;
    renderTextCell.desc = measureText.actualBoundingBoxDescent;
    return renderTextCell;
  }
}