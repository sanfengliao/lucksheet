import { HorizontalType, VerticalType, RenderTextCell, RenderTextCellValue, UnderlineType } from "src/typings";
import { TextDecorateParams, getCancelLine, getUnderLine } from "src/utils/text";
import TextCellTransformer from "./text-cell-transformer";

export interface TextChar {
  fc: string;
  cl: number;
  un: number;
  fs: number;
  wrap?: boolean;
  fontset: string;
  v?: string;
  measureText?: TextMetrics;
}
export interface LineChar {
  content: string;
  style: string | TextChar;
  width: number;
  height: number;
  left: number;
  top: number;
  splitIndex: number;
  asc: number;
  desc: number;
  inline: boolean;
  fs: number;
}

export type Line = LineChar[];

export interface LineSize {
  width: number;
  height: number;
}

export default abstract class WrapTextCellTransformer extends TextCellTransformer {
  abstract parseCellToLineList(): Line[]
  calcRenderTextCellLayout(lineSizeList: LineSize[]) {
    const { horizontalType, verticalType } = this.baseInfo;
    const { cellHeight, cellWidth, spaceWidth, spaceHeight } = this.options;
    let width = 0;
    let height = 0;
    lineSizeList.forEach(item => {
      width = Math.max(width, item.width)
      height += item.height;
    })
    let left = spaceWidth ; // 默认为1，左对齐
    if (horizontalType === HorizontalType.Middle) { // 居中对齐
      left = cellWidth / 2 - width / 2;
    } else if (horizontalType === HorizontalType.Right) { // 右对齐
      left = cellWidth - spaceWidth - width;
    }
    // 默认为2，下对齐
    let top = spaceHeight;
    if (verticalType === VerticalType.Middle) {
      // 居中对齐
      top = cellHeight / 2 - height / 2;
    } else if (verticalType === VerticalType.Top) {
      // 上对齐
      top = cellHeight - height - spaceHeight
    }
    return {
      left,
      top,
      width,
      height,
    }

     
  }
  parseLineList(lineList: Line[]) {
    const { spaceHeight } = this.options;
    let totalWidth = 0;
    const lineSizeList = lineList.map(line => {
      const { width, height, asc, desc } = line.reduce(({ width, height, asc, desc }, char) => {
        return {
          width: width + char.width,
          height: Math.max(height, char.height),
          asc: Math.max(asc, char.asc),
          desc: Math.max(desc, char.desc)
        }
      }, { width: 0, height: 0, asc: 0, desc: 0});
      return {
        width,
        height,
        asc,
        desc
      }
    })

    const renderTextCell = {
      textWidthAll: totalWidth,
      textHeightAll: totalWidth,
      values: [],
      type: 'plainWrap',
    } as unknown as  RenderTextCell;
    let currentLeft = 0;
    let currentTop = 0;
    lineList.forEach((line, index) => {
      const { height, asc, desc } = lineSizeList[index];
      line.forEach(char => {
        const word = char as unknown as RenderTextCellValue;

        word.left = currentLeft;
        word.top = currentTop + asc;
        const decorateParam: TextDecorateParams = {
          width: word.width,
          left: word.left,
          top: word.top,
          asc,
          desc,
          fontSize: char.fs,
        }

        const cancelLine = Number((char.style as TextChar).cl);
        const underLine = Number((char.style as TextChar).un);

        if (cancelLine) {
          word.cancelLine = getCancelLine(decorateParam)
        }
        word.underLine = getUnderLine(underLine as UnderlineType, decorateParam);
        
        renderTextCell.values.push(word);
        currentLeft += char.width;
      })

      currentTop += height + spaceHeight;
      currentLeft = 0;
      
    })
    const { left, top ,height, width } = this.calcRenderTextCellLayout(lineSizeList)
    renderTextCell.textLeftAll = left;

    renderTextCell.textTopAll = top;
    renderTextCell.textHeightAll = height;
    renderTextCell.textWidthAll = width;
    return renderTextCell;
  }

  transform() {
    const lineList = this.parseCellToLineList();
    return this.parseLineList(lineList);
  }
}