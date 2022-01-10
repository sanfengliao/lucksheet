import TextCellTransformer from "./text-cell-transformer";


import { luckysheetfontformat } from "../utils/util";
import { Cell, HorizontalType, RenderTextCell, RenderTextCellValue, TextBreak, UnderlineType, VerticalType  } from "../typings";
import { getCancelLine, getMeasureText, getUnderLine, TextDecorateParams } from "../utils/text";
import WrapTextCellTransformer, { Line, TextChar } from "./wrap-text-cell-transformer";






/**
 * 通过换行符将字符串切割成字符串数组
 * @param str 
 * @returns 
 */
function splitStrByWrapSymbol(str: string) {
  return str.replace(/\r\n/g, '_x000D_').replace(/&#13;&#10;/g, '_x000D_').replace(/\r/g, '_x000D_').replace(/\n/g, '_x000D_').split('_x000D_');
}

export function checkIsNeedWrap({
  width,
  textBreak,
  spaceWidth,
  cellWidth
}: {
  width: number;
  textBreak: TextBreak,
  spaceWidth: number;
  cellWidth: number;
}) {
  if (textBreak !== TextBreak.Wrap) {
    return false;
  }
  return width + spaceWidth > cellWidth;
}

export function parseCell(cell: Cell) {
  const strValList = cell.ct!.s;
  let result: TextChar[] = [];
  strValList.forEach((item) => {
    const fontset = luckysheetfontformat(item);
    const {
      fc = '#000',
      cl = 0,
      un = 0,
      fs = 0,
      v,
    } = item;


    // 将字符串切换层字符数组后，数组每一项都是一行
    const lineStrList  = splitStrByWrapSymbol(v);

    lineStrList.forEach((str, index) => {
      // 空行或者遇到连续两个换行符的时候split之后的数组会存在空字符串 如‘\n'
      if (str === '' && index !== lineStrList.length - 1) {
        addToResult({
          wrap: true,
        });
        return;
      }
      str.split('').forEach(item => {
        addToResult({
          v: item
        })
      })
      if (index !== lineStrList.length - 1) {
        addToResult({
          wrap: true,
        })
      }
    })

    function addToResult(param: Partial<TextChar>) {
      result.push({
        fc,
        cl,
        un,
        fs,
        fontset,
        ...param
      })
    }
  })
  return result;
}



export default class InlineTextCellTransformer extends WrapTextCellTransformer {
  parseCellToLineList() {
    const textCharList: TextChar[] = parseCell(this.cell);
    const { textBreak, } = this.baseInfo;
    const { cellWidth, cellHeight, spaceWidth = 2,
      spaceHeight = 2, } = this.options;
    const { ctx } = this;
    let i = 1;
    let nextLineAchorIndex = 0;
    const lineList: Line[] = [];
    // 当一行文字宽度超过单元格宽度时， 换行的位置
    let wordWrapIndex = 0;
    let splitIndex = 0;
    while (i <= textCharList.length) {
      const currentTextCharList = textCharList.slice(nextLineAchorIndex, i);
      if (currentTextCharList[currentTextCharList.length - 1].wrap) {
        const line: Line = [];
        currentTextCharList.forEach((item, index) => {
          if (index === currentTextCharList.length - 1) return;
          line.push({
            content: item.v!,
            style: item,
            width: item.measureText!.width,
            height: item.measureText!.actualBoundingBoxAscent + item.measureText!.actualBoundingBoxDescent,
            left: 0,
            top: 0,
            splitIndex,
            asc: item.measureText!.actualBoundingBoxAscent,
            desc: item.measureText!.actualBoundingBoxDescent,
            inline: true,
            fs: item.fs,
          });
        })
        lineList.push(line)
        nextLineAchorIndex = i;
        i += 1;
        splitIndex += 1;
        continue;
      }

      // 设置measureText
      currentTextCharList.forEach(item => {
        item.measureText = item.measureText || getMeasureText(ctx, item.v!, item.fontset!)
      })

      // 计算文本的宽高
      const { textHeight, textWidth } = currentTextCharList.reduce((preVal, item) => {
        const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = item.measureText!;
        return {
          textWidth: preVal.textWidth + width,
          textHeight: Math.max(preVal.textHeight, actualBoundingBoxAscent + actualBoundingBoxDescent)
        }
      }, { textWidth: 0, textHeight: 0});

      const width = textWidth;
      const height = textHeight;

      const isNeedWrap = checkIsNeedWrap({
        width,
        spaceWidth,
        cellWidth,
        textBreak,
      })

      if (!isNeedWrap) {
        // 记录换行的位置
        wordWrapIndex = Math.max(wordWrapIndex, i - 1);
      }
      if (isNeedWrap) {
        const line: Line = textCharList.slice(nextLineAchorIndex, wordWrapIndex + 1).map(item => ({
          content: item.v!,
          style: item,
          width: item.measureText!.width,
          height: item.measureText!.actualBoundingBoxAscent + item.measureText!.actualBoundingBoxDescent,
          left: 0,
          top: 0,
          splitIndex,
          asc: item.measureText!.actualBoundingBoxAscent,
          desc: item.measureText!.actualBoundingBoxDescent,
          inline: true,
          fs: item.fs,
        }));
        nextLineAchorIndex = wordWrapIndex + 1;
        i = nextLineAchorIndex + 1;
        splitIndex += 1;
        wordWrapIndex = 0;
        lineList.push(line);
      } else if (i === textCharList.length) {
        const line: Line =  currentTextCharList.map(item => {
          return {
            content: item.v!,
            style: item,
            width: item.measureText!.width,
            height: item.measureText!.actualBoundingBoxAscent + item.measureText!.actualBoundingBoxDescent,
            left: 0,
            top: 0,
            splitIndex,
            asc: item.measureText!.actualBoundingBoxAscent,
            desc: item.measureText!.actualBoundingBoxDescent,
            inline: true,
            fs: item.fs,
          }
        })
        lineList.push(line)
        i +=1
      } else {
        i += 1;
      }
      
    }
    // 计算每一行的尺寸
    return lineList;
  }
}