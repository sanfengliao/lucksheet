import { Cell, CellTextInfoOptions, HorizontalType, RenderTextCell, TextBreak, TextRotateType, VerticalType } from "../typings";
import { luckysheetfontformat } from "../utils/util";
import CellStatus from "../helper/cell-status";

interface BaseInfo {
  horizontalType: HorizontalType;
  verticalType: VerticalType;
  rotateAngle: number;
  textRotate: TextRotateType;
  value: any,
  fontSize: number;
  fontset: string;
  underLine: number;
  cancelLine: number;
  isRotateUp: number;
  textBreak: TextBreak;
}

export default abstract class TextCellTransformer {
  cell: Cell;
  ctx: CanvasRenderingContext2D;
  options: CellTextInfoOptions;
  baseInfo: BaseInfo;
  constructor(cell: Cell, ctx: CanvasRenderingContext2D, options: CellTextInfoOptions) {
    /**
     * @type
     */
    this.cell = cell;
    this.ctx = ctx;
    this.options = options;
    this.baseInfo = this.getBaseInfo();
  }

  getBaseInfo(): BaseInfo {
    const { cell } = this;
    const cellStatus = new CellStatus(cell);
    const horizontalType = cellStatus.getHorizontalType();
    // 垂直对齐
    const verticalType = cellStatus.getVerticalType();
    const textRotate = cellStatus.getTextRotate();
    const fontset = luckysheetfontformat(cell);
    const underLine = cellStatus.get('un');// underLine
    const cancelLine = cellStatus.get('cl');
    const fontSize = cellStatus.getFontSize();
    const textBreak = cellStatus.getTextBreak();
    const value = cell.m || cell.v || cell;
    let rotateAngle = cellStatus.getRotateAngle(); // rotate angle

    let isRotateUp = 1;
    const textRotateMap: Record<TextRotateType, number> = {
      [TextRotateType.Horizontal]: 0,
      [TextRotateType.TopRight]: 45,
      [TextRotateType.ButtonRight]: -45,
      [TextRotateType.Top]: 90,
      [TextRotateType.Button]: -90,
      // 去除ts错误
      [TextRotateType.Vertical]: 0,
    };

    rotateAngle = rotateAngle || textRotateMap[textRotate] || 0;

    // if (rotateAngle > 180 || rotateAngle < 0) {
    //   rotateAngle = 0;
    // }

    // if (rotateAngle > 90) {
    //   rotateAngle = 90 - rotateAngle;
    //   isRotateUp = 0;
    // }

    return {
      horizontalType,
      verticalType,
      rotateAngle,
      textRotate,
      value,
      fontSize,
      fontset,
      underLine,
      cancelLine,
      isRotateUp,
      textBreak,
    }
  }

  abstract transform(): RenderTextCell;
}