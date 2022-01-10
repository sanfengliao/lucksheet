import { TextBreak } from "../typings";
import { getMeasureText } from "../utils/text";
import { luckysheetfontformat } from "../utils/util";
import { checkIsNeedWrap } from "./inline-text-cell-transformer";
import WrapTextCellTransformer, { Line } from "./wrap-text-cell-transformer";

export default class NormalWrapTextCellTransformer extends WrapTextCellTransformer {
  parseCellToLineList(): Line[] {
    const { cell, ctx } = this;
    const { fontSize } = this.baseInfo;
    const { cellHeight, cellWidth, spaceHeight, spaceWidth } = this.options
    const fontset = luckysheetfontformat(cell);
    ctx.font = fontset;
    const value: string = (cell.m || cell.v || cell).toString();
    let i = 1;
    let nextLineAchorIndex = 0;
    const lineList: Line[] = [];
    // 当一行文字宽度超过单元格宽度时， 换行的位置
    let wordWrapIndex = 0;
    let splitIndex = 0;
    while (i <= value.length) {
      const subStr = value.slice(nextLineAchorIndex, i);

      const measureText = getMeasureText(ctx, subStr);
      const textWidth = measureText.width;
      const textHeight = measureText.actualBoundingBoxAscent + measureText.actualBoundingBoxDescent;

      const width = textWidth;

      const isNeedWrap = checkIsNeedWrap({
        width,
        spaceWidth,
        cellWidth,
        textBreak: TextBreak.Wrap,
      })
      if (!isNeedWrap) {
        // 记录换行的位置
        wordWrapIndex = Math.max(wordWrapIndex, i - 1);
      }
      if (isNeedWrap) {
        const val = value.slice(nextLineAchorIndex, wordWrapIndex + 1);
        const textMetrics: TextMetrics = getMeasureText(ctx, val);
        const line: Line = [{
          content: val,
          style: fontset,
          width: textMetrics.width,
          height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent,
          left: 0,
          top: 0,
          splitIndex,
          asc: textMetrics.actualBoundingBoxAscent,
          desc: textMetrics.actualBoundingBoxDescent,
          inline: false,
          fs: fontSize,
        }];
        nextLineAchorIndex = wordWrapIndex + 1;
        i = nextLineAchorIndex + 1;
        splitIndex += 1;
        wordWrapIndex = 0;
        lineList.push(line);
      } else if (i === value.length) {
        const line: Line =  [{
            content: subStr,
            style: fontset,
            width: measureText!.width,
            height: measureText!.actualBoundingBoxAscent + measureText!.actualBoundingBoxDescent,
            left: 0,
            top: 0,
            splitIndex,
            asc: measureText.actualBoundingBoxAscent,
            desc: measureText!.actualBoundingBoxDescent,
            inline: false,
            fs: fontSize,
        }];
        lineList.push(line)
        i +=1
      } else {
        i += 1;
      }
    }
    return lineList;
  }
  
}