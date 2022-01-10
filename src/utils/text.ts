import Store from '../store';
import locale from '../locale/locale';
import { hasChinaword } from '../global/validate';
import { UnderlineType } from '../typings';

const textSizeCache = Object.create(null);

/**
 * 获取text的官高
 * @param text 
 * @param font 
 * @returns 
 */
export const getTextSize = (text: string, font: string) => {
  const fontArr = locale().fontarray;
  const f = font || `10pt ${fontArr[0]}`;
  if (textSizeCache[f]) {
    return textSizeCache[f];
  }
  let sizeDetectDom = document.querySelector('.sizeDetectDom');
  sizeDetectDom = document.createElement('span');
  sizeDetectDom.setAttribute('style', `float:left;white-space:nowrap;visibility:hidden;margin:0;padding:0; font: ${f}`);
  sizeDetectDom.textContent = text;
  document.body.append(sizeDetectDom);
  const w = sizeDetectDom.clientWidth;
  const h = sizeDetectDom.clientHeight;
  textSizeCache[f] = [w, h];
  return [w, h];
};

export const getMeasureText = (ctx: CanvasRenderingContext2D, value: string, fontset?: string): TextMetrics => {
  const font = fontset || ctx.font;
  const cacheKey = `${value}_${Store.zoomRatio}_${font}`;
  const mtc = (Store.measureTextCache as any)[cacheKey];

  if (mtc) {
    return mtc;
  }

  if (fontset) {
    ctx.font = fontset;
  }

  const measureText = ctx.measureText(value);
  const cache = {} as any;

  cache.width = measureText.width;

  cache.actualBoundingBoxDescent = measureText.actualBoundingBoxDescent;
  cache.actualBoundingBoxAscent = measureText.actualBoundingBoxAscent;
  if (typeof cache.actualBoundingBoxAscent !== 'number' || typeof cache.actualBoundingBoxDescent !== 'number') {
    let commonWord = 'M';
    if (hasChinaword(value)) {
      commonWord = '田';
    }
    const oneLineTextHeight = getTextSize(commonWord, ctx.font)[1] * 0.8;
    if (ctx.textBaseline === 'top') {
      cache.actualBoundingBoxDescent = oneLineTextHeight;
      cache.actualBoundingBoxAscent = 0;
    } else if (ctx.textBaseline === 'middle') {
      cache.actualBoundingBoxDescent = oneLineTextHeight / 2;
      cache.actualBoundingBoxAscent = oneLineTextHeight / 2;
    } else {
      cache.actualBoundingBoxDescent = 0;
      cache.actualBoundingBoxAscent = oneLineTextHeight;
    }
  }

  if (ctx.textBaseline === 'alphabetic') {
    const descText = 'gjpqy';
    const matchText = 'abcdABCD';
    const descTextMeasure = ctx.measureText(descText);
    const matchTextMeasure = ctx.measureText(matchText);
    if (cache.actualBoundingBoxDescent <= matchTextMeasure.actualBoundingBoxDescent) {
      cache.actualBoundingBoxDescent = descTextMeasure.actualBoundingBoxDescent;
      if (typeof cache.actualBoundingBoxDescent !== 'number') {
        cache.actualBoundingBoxDescent = 0;
      }
    }
  }

  cache.width *= Store.zoomRatio;
  cache.actualBoundingBoxDescent *= Store.zoomRatio;
  cache.actualBoundingBoxAscent *= Store.zoomRatio;
  (Store.measureTextCache as any)[cacheKey] = cache;
  return cache as TextMetrics;
}

export interface TextDecorateParams {
  // 横坐标
  left: number;
  // 纵坐标
  top: number;
  // 宽
  width: number;
  // 大小
  fontSize: number;
  // TextMetrics.actualBoundingBoxAscent 
  asc: number;
  // TextMetrics.actualBoundingBoxDescent
  desc: number;
}


export const getCancelLine = (options: TextDecorateParams) => {
  const {
    left,
    top,
    asc,
    width,
    fontSize
  } = options;
  return {
    startX: left,
    startY: top - asc / 2 + 1,
    endX: left + width,
    endY: top - asc / 2 + 1,
    fs: fontSize,
  };
}

export const getUnderLine = (underLineType: UnderlineType, options: TextDecorateParams) => {
  if (underLineType === 0) {
    return;
  }
  const {
    left,
    top,
    width,
    desc,
    fontSize
  } = options;
  const underLineInfoMap = {
    1:[
      {
        startX: left,
        startY: top + 3,
        endX: left + width,
        endY: top + 3,
        fs: fontSize,
      }
    ], 
    2: [
      {
        startX: left,
        startY: top + 3,
        endX: left + width,
        endY: top + 3,
        fs: fontSize,
      },
      {
        startX: left,
        startY: top + desc,
        endX: left + width,
        endY: top + desc,
        fs: fontSize,
      }
    ],
    3: [
      {
        startX: left,
        startY: top + desc,
        endX: left + width,
        endY: top + desc,
        fs: fontSize,
      }
    ],
    4: [
      {
        startX: left,
        startY: top + desc,
        endX: left + width,
        endY: top + desc,
        fs: fontSize,
      },
      {
        startX: left,
        startY: top + desc + 2,
        endX: left + width,
        endY: top + desc + 2,
        fs: fontSize,
      }
    ],
  }
  return underLineInfoMap[underLineType];
}
