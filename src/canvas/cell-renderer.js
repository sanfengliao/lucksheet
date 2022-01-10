import conditionformat from '../controllers/conditionformat';
import alternateformat from '../controllers/alternateformat';
import menuButton from '../controllers/menuButton';
import Store from '../store/index';
import method from '../global/method';
import sheetmanage from '../controllers/sheetmanage';
import { getCellTextInfo } from '../helper/cell-text-info';
import dataVerificationCtrl from '../controllers/dataVerificationCtrl';
import { isRealNum } from '../global/validate';
import { luckysheetdefaultstyle } from '../controllers/constant';

class CellRenderer {
  constructor(ctx, textRenderer, lineRenderer) {
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;
    /**
     * @type {import('./text-renderer').default}
     */
    this.textRenderer = textRenderer;

    /**
     * @type {import('./line-renderer').default}
     */
    this.lineRenderer = lineRenderer;
  }

  /**
   *
   * @param {import('@/typings').CellRenderParam} param
   */
  render(param) {
    const {
      row,
      col,
      endCol,
      startCol,
      endRow,
      startRow,
      afCompute,
      cfCompute,
      offsetLeft,
      offsetTop,
      isMerge,
      cellOverflowMap,
      datasetColStart,
      datasetColEnd,
      border05,
    } = param;

    const {
      /**
       * @type {CanvasRenderingContext2D}
       */
      ctx,
    } = this;
    const cell = Store.flowdata[row][col];
    const cellWidth = endCol - startCol - 2;
    const cellHeight = endRow - startRow - 2;
    const spaceWidth = 2; const
      spaceHeight = 2;
    // TODO
    // 是否垂直对齐
    const horizonAlign = menuButton.checkstatus(Store.flowdata, row, col, 'ht');
    // 是否水平对置
    const verticalAlign = menuButton.checkstatus(Store.flowdata, row, col, 'vt');

    // 交替颜色
    const checksAF = alternateformat.checksAF(row, col, afCompute);
    // 条件格式
    const checksCF = conditionformat.checksCF(row, col, cfCompute);
    let fillStyle = menuButton.checkstatus(Store.flowdata, row, col, 'bg');
    if (checksAF && checksAF[1]) { // 若单元格有交替颜色 背景颜色
      fillStyle = checksAF[1];
    }
    if (checksCF && checksCF.cellColor) { // 若单元格有条件格式 背景颜色
      fillStyle = checksCF.cellColor;
    }
    if (fillStyle === null) {
      ctx.fillStyle = '#FFFFFF';
    } else {
      ctx.fillStyle = fillStyle;
    }

    const borderFix = menuButton.borderfix(Store.flowdata, row, col);

    const cellSize = {
      // 横坐标
      x: offsetLeft + startCol + borderFix[0],
      // 纵坐标
      y: offsetTop + startRow + borderFix[1],
      // 宽度
      width: endCol - startCol + borderFix[2] - (isMerge ? 1 : 0),
      // 高
      height: endRow - startRow + borderFix[3],
    };

    if (!method.createHookFunction('cellRenderBofore', Store.flowdata[row][col], {
      r: row,
      c: col,
      start_r: cellSize.y,
      start_c: cellSize.x,
      end_r: cellSize.y + cellSize.height,
      end_c: cellSize.x + cellSize.width,
    }, sheetmanage.getSheetByIndex(), ctx)) {
      return;
    }

    this.ctx.fillRect(cellSize.x, cellSize.y, cellSize.width, cellSize.height);

    const { dataVerification } = dataVerificationCtrl;

    if (dataVerification && dataVerification[`${row}_${col}`] && !dataVerificationCtrl.validateCellData(value, dataVerification[`${row}_${col}`])) {
      console.log('dataVerification && dataVerification[`${row}_${col}`] && !dataVerificationCtrl.validateCellData(value, dataVerification[`${row}_${col}`])');
    }

    if (cell.ps) {
      console.log('cell.ps');
    }

    if (cell.qp === 1 && isRealNum(cell.v)) {
      console.log('cell.qp === 1 && isRealNum(cell.v)');
    }

    const cellOverflowBdRRender = true;
    const cellOverflowColInObj = cellOverflowColIn(cellOverflowMap, row, col, datasetColStart, datasetColEnd);

    if (cell.tb == '1' && cellOverflowColInObj.colIn) {
      // TODO
      console.log('cell.tb == \'1\' && cellOverflow_colInObj.colIn');
    } else if (dataVerification && dataVerification[`${r}_${c}`] && dataVerification[`${r}_${c}`].type == 'checkbox') {
      console.log('dataVerification && dataVerification[r + \'_\' + c] && dataVerification[r + \'_\' + c].type == \'checkbox\'');
    } else {
      if (checksCF && checksCF.dataBar && checksCF.dataBar.valueLen && checksCF.dataBar.valueLen.toString() !== 'NaN') {
        console.log('checksCF && checksCF.dataBar && checksCF.dataBar.valueLen && checksCF.dataBar.valueLen.toString() !== \'NaN\'');
      }
      const posX = startCol + offsetLeft;
      const posY = startRow + offsetTop + 1;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(posX, posY, cellWidth, cellHeight);
      this.ctx.clip();
      this.ctx.scale(Store.zoomRatio, Store.zoomRatio);

      const textInfo = getCellTextInfo(cell, this.ctx, {
        cellWidth,
        cellHeight,
        spaceWidth,
        spaceHeight,
        r: row,
        c: col,
      });

      if (checksCF && checksCF.icons && textInfo.type === 'plain') {
        console.log('checksCF && checksCF.icons && textInfo.type === "plain"');
      }

      this.ctx.fillStyle = menuButton.checkstatus(Store.flowdata, row,
        col, 'fc');

      if (checksAF && checksAF[0]) {
        console.log('checksAF && checksAF[0]');
      }
      // 若单元格有条件格式 文本颜色
      if (checksCF && checksCF.textColor) {
        console.log('checksCF && checksCF.textColor');
      }

      // 若单元格格式为自定义数字格式（[red]） 文本颜色为红色
      if (cell.ct && cell.ct.fa && cell.ct.fa.indexOf('[Red]') > -1 && cell.ct.t == 'n' && cell.v < 0) {
        console.log('cell.ct && cell.ct.fa && cell.ct.fa.indexOf(\'[Red]\') > -1 && cell.ct.t == \'n\' && cell.v < 0');
      }

      this.textRenderer.render(textInfo, {
        posX,
        posY,
      });
      this.ctx.restore();
    }

    if (cellOverflowBdRRender) {
      if (Store.luckysheetcurrentisPivotTable && !fillStyle && Store.showGridLines) {
        // 右边框
        this.lineRenderer.render({
          start: {
            x: endCol + offsetLeft - 2 + border05,
            y: startRow + offsetTop,
          },
          end: {
            x: endCol + offsetLeft - 2 + border05,
            y: endRow + offsetTop,
          },
          width: 1,
          style: luckysheetdefaultstyle.strokeStyle,
        });
      }
    }
    if (!Store.luckysheetcurrentisPivotTable && !fillStyle && Store.showGridLines) {
      this.lineRenderer.render({
        start: {
          x: startCol + offsetLeft - 1,
          y: endRow + offsetTop - 2 + border05,
        },
        end: {
          x: endCol + offsetLeft - 1,
          y: endRow + offsetTop - 2 + border05,
        },
        width: 1,
        style: luckysheetdefaultstyle.strokeStyle,
      });
    }

    method.createHookFunction('cellRenderBofore', Store.flowdata[row][col], {
      r: row,
      c: col,
      start_r: cellSize.y,
      start_c: cellSize.x,
      end_r: cellSize.y + cellSize.height,
      end_c: cellSize.x + cellSize.width,
    }, sheetmanage.getSheetByIndex(), ctx);
  }
}

function cellOverflowColIn(map, r, c, col_st, col_ed) {
  let colIn = false; // 此单元格 是否在 某个溢出单元格的渲染范围
  let colLast = false; // 此单元格 是否是 某个溢出单元格的渲染范围的最后一列
  let rowIndex; // 溢出单元格 行下标
  let colIndex; // 溢出单元格 列下标
  let stc;
  let edc;

  for (const rkey in map) {
    for (const ckey in map[rkey]) {
      rowIndex = rkey;
      colIndex = ckey;
      // rowIndex = key.substr(0, key.indexOf('_'));
      // colIndex = key.substr(key.indexOf('_') + 1);
      const mapItem = map[rkey][ckey];
      stc = mapItem.stc;
      edc = mapItem.edc;

      if (rowIndex == r) {
        if (c >= stc && c <= edc) {
          colIn = true;

          if (c == edc || c == col_ed) {
            colLast = true;
            break;
          }
        }
      }
    }

    if (colLast) {
      break;
    }
  }

  return {
    colIn,
    colLast,
    rowIndex,
    colIndex,
    stc,
    edc,
  };
}

export default CellRenderer;
