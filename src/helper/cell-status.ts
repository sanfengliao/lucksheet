import { Cell, HorizontalType, TextBreak, TextRotateType, VerticalType } from '../typings';
import { isInlineStringCell } from '../controllers/inlineString';
import { rgbTohex } from '../utils/util';

const Color = {
  Black: '#000000',
};
/**
 *
 * @param {string} color
 * @returns
 */
const toHex = (color: string) => {
  if (color.includes('rgba')) {
    return rgbTohex(color);
  }
  return color;
};
/**
 * 同checkstatusByCell功能
 */
class CellStatus {
  private cell: Cell;
  constructor(cell: Cell) {
    /**
     * @type {import('@/typings').Cell}
     */
    this.cell = cell;
  }

  setCell(cell: Cell) {
    this.cell = cell;
  }

  getFontColor() {
    const { cell } = this;
    if (!cell) {
      return Color.Black;
    }
    const fontColor = cell.fc;
    if (!fontColor) {
      return Color.Black;
    }
    return toHex(fontColor);
  }

  getBgColor() {
    const { cell } = this;
    if (!cell) {
      return null;
    }
    const bgColor = cell.bg;
    if (!bgColor) {
      return null;
    }
    return toHex(bgColor);
  }

  // 我也不知道下面两个是啥玩意
  /**
   *
   * @param {string} key
   * @returns {string}
   */
  getBs(key: keyof Cell) {
    const { cell } = this;
    if (!cell) {
      return 'none';
    }
    const bs = cell[key];
    return bs || 'none';
  }

  getBc(key: keyof Cell) {
    const { cell } = this;
    if (!cell) {
      return '#000000';
    }
    const bs = cell[key];
    return bs || '#000000';
  }

  getHorizontalType(): HorizontalType {
    const { cell } = this;
    if (!cell) {
      return HorizontalType.Left;
    }
    const horizontalType = cell.ht as HorizontalType;
    if (typeof horizontalType === 'undefined') {
      return HorizontalType.Left;
    }
    return [HorizontalType.Left, HorizontalType.Middle, HorizontalType.Right].includes(Number(horizontalType)) ? Number(horizontalType) : HorizontalType.Left;
  }

  getVerticalType(): VerticalType {
    const { cell } = this;
    if (!cell || !cell.vt) {
      return VerticalType.Middle;
    }
    const verticalType = cell.vt;
    if (typeof verticalType === 'undefined') {
      return VerticalType.Middle;
    }
    return [VerticalType.Middle, VerticalType.Top, VerticalType.Bottom].includes(Number(verticalType)) ? Number(verticalType) : VerticalType.Middle;
  }

  getCellType() {
    const { cell } = this;
    if (!cell || !cell.ct) {
      return 0;
    }
    return Number(cell.ct!) || 0;
  }

  getFontSize() {
    const { cell } = this;
    if (!cell || !cell.fs) {
      return 0;
    }
    return Number(cell.fs) || 10;
  }

  getTextBreak(): TextBreak {
    const { cell } = this;
    if (!cell || !cell.tb) {
      return 0;
    }
    return Number(cell.tb) || 0;
  }

  getTextRotate(): TextRotateType {
    const { cell } = this;
    if (!cell) {
      return TextRotateType.Horizontal;
    }
    return (Number(cell.tr) as TextRotateType) || TextRotateType.Horizontal;
  }

  getRotateAngle() {
    const { cell } = this;
    if (!cell) {
      return 0;
    }
    return -Number(cell.rt) || 0;
  }

  get(key: keyof Cell) {
    const { cell } = this;
    const tf = ['bl', 'it', 'ff', 'cl', 'un'];
    if (tf.includes(key) || (key === 'fs' && isInlineStringCell(cell))) {
      if (!this.cell) {
        return 0;
      }
      return Number(this.cell[key]) || 0;
    }
    return 0;
  }
}

export default CellStatus;
