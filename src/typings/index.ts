export interface RenderTextCellValue {
  content: string | {
    m: string;
  };
  height: number;
  left: number;
  top: number;
  width: number;
  style: string | {
    fontset: string;
    fc: string;
  };
  inline: boolean;
  cancelLine: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    fs: number;
  }
  underLine?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    fs: number;
  }[]
}
export interface RenderTextCell {
  values: RenderTextCellValue[];
  asc?: number;
  desc?: number;
  rotate: number;
  textHeightAll: number;
  textLeftAll: number;
  textTopAll: number;
  textWidthAll: number;
  type: string;
}

export interface DrawTextOptions {
  posX: number;
  posY: number;
}

export interface CellRenderParam {
  // 二维数组的下标
  // 第几行数据
  row: number;
  // 第几列数据
  col: number;
  // 起始横坐标
  startRow: number; //
  // 终点横坐标
  endRow: number;
  // 起始纵坐标
  startCol: number;
  // 终点纵坐标
  endCol: number;
  // 横坐标偏移量
  offsetTop: number,
  // 纵坐标偏移量
  offsetLeft: number;
  // 从哪一列到哪一列
  datasetColStart: number;
  datasetColEnd: string;
  // 文本值
  value: any,
  afCompute: unknown;
  cfCompute: unknown;
  dynamicArrayCompute: unknown;
  cellOverflowMap: unknown;
  scrollHeight: number;
  scrollWidth: number;
  border05: unknown;
  isMerge: boolean;
}

export const enum HorizontalType {
  Middle = 0,
  Left = 1,
  Right = 2,
}

export const enum VerticalType {
  Middle = 0,
  Top = 1,
  Bottom = 2,
}

export type UnderlineType = 0 | 1 | 2 | 3 | 4

export const enum TextRotateType {
  Horizontal = 0,
  TopRight = 1,
  ButtonRight = 2,
  Vertical = 3,
  Top = 4,
  Button = 5,
}

export interface CellType {
  fa: string;
  t: 'inlineStr' | string;
  s: {
    ff: string;
    fc: string;
    fs: number;
    cl: number;
    un: number;
    bl: number;
    it: number;
    v: string;
  }[]
}

export const enum TextBreak {
  Truncated = 0,
  Overflow = 1,
  Wrap = 2,
}

export interface Cell {
  fc?: string;
  bg?: string;
  ht?: HorizontalType;
  vt?: VerticalType;
  ct?: CellType;
  fs?: string | number;
  tb?: TextBreak;
  tr?: TextRotateType;
  rt?: string | number;
  m?: any;
  v?: any;
  un?: UnderlineType,
  cl?: 0 | 1;
}

export interface CellTextInfoOptions {
  cellWidth: number;
  cellHeight: number;
  spaceWidth: number;
  spaceHeight: number;
  r: number;
  c: number;
}
