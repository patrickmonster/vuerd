import { CommandEffect } from "../Command";
import { Store } from "../Store";
import { getData, uuid } from "../Helper";
import { Logger } from "../Logger";
import { ColumnModel } from "../model/ColumnModel";
import { focusTableExecute } from "./editor";

export interface AddColumn {
  id: string;
  tableId: string;
}
export function addColumn(
  store: Store,
  tableId?: string
): CommandEffect<Array<AddColumn>> {
  return {
    name: "column.add",
    data: tableId
      ? [
          {
            id: uuid(),
            tableId,
          },
        ]
      : store.tableState.tables
          .filter(table => table.ui.active)
          .map(table => {
            return {
              id: uuid(),
              tableId: table.id,
            };
          }),
  };
}
export function addColumnExecute(store: Store, data: AddColumn[]) {
  Logger.debug("addColumnExecute");
  const { tables } = store.tableState;
  data.forEach(addColumn => {
    const table = getData(tables, addColumn.tableId);
    if (table) {
      focusTableExecute(store, {
        tableId: table.id,
      });
      table.columns.push(new ColumnModel({ addColumn }));
    }
  });
}

export interface RemoveColumn {
  tableId: string;
  columnIds: string[];
}
export function removeColumn(
  tableId: string,
  columnIds: string[]
): CommandEffect<RemoveColumn> {
  return {
    name: "column.remove",
    data: {
      tableId,
      columnIds,
    },
  };
}
export function removeColumnExecute(store: Store, data: RemoveColumn) {
  Logger.debug("removeColumnExecute");
  const { tables } = store.tableState;
  const table = getData(tables, data.tableId);
  if (table) {
    for (let i = 0; i < table.columns.length; i++) {
      const id = table.columns[i].id;
      if (data.columnIds.some(columnId => columnId === id)) {
        table.columns.splice(i, 1);
        i--;
      }
    }
  }
}

export interface ChangeColumnNotNull {
  tableId: string;
  columnId: string;
  notNull: boolean;
}
export function changeColumnNotNull(
  store: Store,
  tableId: string,
  columnId: string
): CommandEffect<ChangeColumnNotNull> {
  let notNull = false;
  const { tables } = store.tableState;
  const table = getData(tables, tableId);
  if (table) {
    const column = getData(table.columns, columnId);
    if (column) {
      notNull = !column.option.notNull;
    }
  }
  return {
    name: "column.changeNotNull",
    data: {
      tableId,
      columnId,
      notNull,
    },
  };
}
export function changeColumnNotNullExecute(
  store: Store,
  data: ChangeColumnNotNull
) {
  Logger.debug("changeColumnNotNullExecute");
  const { tables } = store.tableState;
  const table = getData(tables, data.tableId);
  if (table) {
    const column = getData(table.columns, data.columnId);
    if (column) {
      column.option.notNull = data.notNull;
    }
  }
}

export interface ChangeColumnPrimaryKey {
  tableId: string;
  columnId: string;
  primaryKey: boolean;
}
export function changeColumnPrimaryKey(
  store: Store,
  tableId: string,
  columnId: string
): CommandEffect<ChangeColumnPrimaryKey> {
  let primaryKey = false;
  const { tables } = store.tableState;
  const table = getData(tables, tableId);
  if (table) {
    const column = getData(table.columns, columnId);
    if (column) {
      primaryKey = !column.option.primaryKey;
    }
  }
  return {
    name: "column.changePrimaryKey",
    data: {
      tableId,
      columnId,
      primaryKey,
    },
  };
}
export function changeColumnPrimaryKeyExecute(
  store: Store,
  data: ChangeColumnPrimaryKey
) {
  Logger.debug("changeColumnPrimaryKeyExecute");
  const { tables } = store.tableState;
  const table = getData(tables, data.tableId);
  if (table) {
    const column = getData(table.columns, data.columnId);
    if (column) {
      if (data.primaryKey) {
        if (column.ui.fk) {
          column.ui.fk = false;
          column.ui.pfk = true;
        } else {
          column.ui.pk = true;
        }
      } else {
        if (column.ui.pfk) {
          column.ui.pfk = false;
          column.ui.fk = true;
        } else {
          column.ui.pk = false;
        }
      }
      column.option.primaryKey = data.primaryKey;
    }
  }
}
