import { LexicalEditor, $getSelection, $isRangeSelection } from "lexical";
import { BaseExtension } from "@lyfie/luthor-headless/extensions/base";
import { ExtensionCategory } from "@lyfie/luthor-headless/extensions/types";
import { BaseExtensionConfig } from "@lyfie/luthor-headless/extensions/types";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { markdownExtension } from "../export/MarkdownExtension";
import { useBaseEditor as useEditor } from "../../core/createEditorSystem";
import {
  TableNode,
  TableRowNode,
  TableCellNode,
  TableCellHeaderStates,
  $createTableNodeWithDimensions,
  $isTableNode,
  $isTableRowNode,
  $isTableCellNode,
  $findCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $getTableColumnIndexFromTableCellNode,
  $mergeCells,
  $unmergeCell,
} from "@lexical/table";
import {
  INSERT_TABLE_COMMAND,
  $isTableSelection,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
} from "@lexical/table";
import { $createParagraphNode, $createTextNode } from "lexical";
import {
  ContextMenuItem,
  ContextMenuProvider,
  ContextMenuRenderer,
  ContextMenuExtension,
  contextMenuExtension
} from "@lyfie/luthor-headless/extensions/core/ContextMenuExtension";

/**
 * Table extension configuration options.
 */
export type TableConfig = BaseExtensionConfig & {
  rows?: number;
  columns?: number;
  includeHeaders?: boolean;
  /** Enable right-click context menu */
  enableContextMenu?: boolean;
  /** Custom context menu items - static list or a function that receives commands */
  contextMenuItems?: ContextMenuItem[] | ((commands: TableCommands) => ContextMenuItem[]);
  /** Custom context menu renderer for full headless control */
  contextMenuRenderer?: ContextMenuRenderer;
  /** Context menu extension used to register providers */
  contextMenuExtension?: typeof contextMenuExtension;
  /** Markdown extension used to register transformers */
  markdownExtension?: typeof markdownExtension;
};

/**
 * Commands exposed by the Table extension.
 */
export type TableCommands = {
  insertTable: (config: { rows?: number; columns?: number; includeHeaders?: boolean }) => void;
  insertRowAbove: () => void;
  insertRowBelow: () => void;
  insertColumnLeft: () => void;
  insertColumnRight: () => void;
  toggleRowHeader: () => void;
  toggleColumnHeader: () => void;
  mergeSelectedCells: () => void;
  unmergeSelectedCell: () => void;
  deleteRow: () => void;
  deleteColumn: () => void;
  deleteTable: () => void;
  showTableContextMenu: (position: { x: number; y: number }) => void;
};

/**
 * State queries exposed by the Table extension.
 */
export type TableStateQueries = {
  isTableSelected: () => Promise<boolean>;
  isInTableCell: () => Promise<boolean>;
};

function getSelectedTableCell(): TableCellNode | null {
  const selection = $getSelection();

  if ($isTableSelection(selection)) {
    const selectedCell = selection.getNodes().find((node) => $isTableCellNode(node));
    if ($isTableCellNode(selectedCell)) {
      return selectedCell;
    }
  }

  if ($isRangeSelection(selection)) {
    const anchorNode = selection.anchor.getNode();
    const cellNode = $findCellNode(anchorNode);
    if ($isTableCellNode(cellNode)) {
      return cellNode;
    }
  }

  return null;
}

function TableQuickActionsPlugin() {
  const { editor } = useEditor();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [overlayState, setOverlayState] = useState<{
    columnHandles: Array<{ x: number; y: number; columnIndex: number }>;
    rowHandles: Array<{ x: number; y: number; rowIndex: number }>;
  }>({
    columnHandles: [],
    rowHandles: [],
  });

  const runWithTargetCellSelection = (rowIndex: number, columnIndex: number, action: () => void) => {
    if (!editor) {
      return;
    }

    editor.update(() => {
      const selectedCell = getSelectedTableCell();
      if (!selectedCell) {
        return;
      }

      const tableNode = $getTableNodeFromLexicalNodeOrThrow(selectedCell);
      const rowNode = tableNode.getChildren()[rowIndex];
      if (!$isTableRowNode(rowNode)) {
        return;
      }

      const targetCell = rowNode.getChildren()[columnIndex];
      if (!$isTableCellNode(targetCell)) {
        return;
      }

      targetCell.selectStart();
      action();
    });
  };

  const insertColumnAfter = (columnIndex: number) => {
    runWithTargetCellSelection(0, columnIndex, () => {
      $insertTableColumnAtSelection(true);
    });
  };

  const deleteColumnAt = (columnIndex: number) => {
    runWithTargetCellSelection(0, columnIndex, () => {
      $deleteTableColumnAtSelection();
    });
  };

  const insertRowAfter = (rowIndex: number) => {
    runWithTargetCellSelection(rowIndex, 0, () => {
      $insertTableRowAtSelection(true);
    });
  };

  const deleteRowAt = (rowIndex: number) => {
    runWithTargetCellSelection(rowIndex, 0, () => {
      $deleteTableRowAtSelection();
    });
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    const rootElement = editor.getRootElement();
    const container = (rootElement?.closest(".luthor-editor-wrapper") as HTMLElement | null)
      || rootElement?.parentElement
      || null;
    setPortalContainer(container);

    const updateQuickActionsPosition = () => {
      editor.getEditorState().read(() => {
        const selectedCell = getSelectedTableCell();
        if (!selectedCell) {
          setOverlayState({ columnHandles: [], rowHandles: [] });
          return;
        }

        const cellElement = editor.getElementByKey(selectedCell.getKey());
        if (!cellElement) {
          setOverlayState({ columnHandles: [], rowHandles: [] });
          return;
        }

        const tableElement = cellElement.closest("table");
        if (!tableElement || !container) {
          setOverlayState({ columnHandles: [], rowHandles: [] });
          return;
        }

        const containerRect = container.getBoundingClientRect();
        const firstRow = tableElement.querySelector("tr");
        const rowElements = Array.from(tableElement.querySelectorAll("tr"));
        if (!firstRow || rowElements.length === 0) {
          setOverlayState({ columnHandles: [], rowHandles: [] });
          return;
        }

        const headerCells = Array.from(firstRow.children).filter(
          (element): element is HTMLTableCellElement =>
            element instanceof HTMLTableCellElement,
        );

        const columnHandles = headerCells.map((cell, index) => {
          const cellRect = cell.getBoundingClientRect();
          return {
            x: cellRect.right - containerRect.left,
            y: cellRect.top - containerRect.top - 12,
            columnIndex: index,
          };
        });

        const rowHandles = rowElements
          .map((row, index) => {
            const firstCell = row.children[0];
            if (!(firstCell instanceof HTMLTableCellElement)) {
              return null;
            }

            const cellRect = firstCell.getBoundingClientRect();
            return {
              x: cellRect.left - containerRect.left - 12,
              y: cellRect.bottom - containerRect.top,
              rowIndex: index,
            };
          })
          .filter((value): value is { x: number; y: number; rowIndex: number } => value !== null);

        setOverlayState({
          columnHandles,
          rowHandles,
        });
      });
    };

    updateQuickActionsPosition();

    const unregisterUpdate = editor.registerUpdateListener(() => {
      updateQuickActionsPosition();
    });

    const handleViewportChange = () => {
      updateQuickActionsPosition();
    };

    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      unregisterUpdate();
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [editor]);

  if (!portalContainer || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      {overlayState.columnHandles.map((handle) => (
        <div
          key={`column-handle-${handle.columnIndex}`}
          className="luthor-table-divider-controls luthor-table-divider-controls-column"
          style={{
            position: "absolute",
            left: handle.x,
            top: handle.y,
            zIndex: 20,
          }}
        >
          <button
            type="button"
            className="luthor-table-divider-button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => insertColumnAfter(handle.columnIndex)}
            title="Add column"
            aria-label="Add column"
          >
            +
          </button>
          <button
            type="button"
            className="luthor-table-divider-button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => deleteColumnAt(handle.columnIndex)}
            title="Remove column"
            aria-label="Remove column"
          >
            −
          </button>
        </div>
      ))}
      {overlayState.rowHandles.map((handle) => (
        <div
          key={`row-handle-${handle.rowIndex}`}
          className="luthor-table-divider-controls luthor-table-divider-controls-row"
          style={{
            position: "absolute",
            left: handle.x,
            top: handle.y,
            zIndex: 20,
          }}
        >
          <button
            type="button"
            className="luthor-table-divider-button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => insertRowAfter(handle.rowIndex)}
            title="Add row"
            aria-label="Add row"
          >
            +
          </button>
          <button
            type="button"
            className="luthor-table-divider-button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => deleteRowAt(handle.rowIndex)}
            title="Remove row"
            aria-label="Remove row"
          >
            −
          </button>
        </div>
      ))}
    </>,
    portalContainer,
  );
}

/**
 * Table extension for table operations in the editor.
 * Provides commands for inserting and manipulating tables.
 */
export class TableExtension extends BaseExtension<
  "table",
  TableConfig,
  TableCommands,
  TableStateQueries,
  ReactNode[]
> {
  getContextMenuItems(commands: TableCommands): ContextMenuItem[] {
    if (typeof this.config.contextMenuItems === 'function') {
      return this.config.contextMenuItems(commands);
    }
    if (Array.isArray(this.config.contextMenuItems)) {
      return this.config.contextMenuItems;
    }
    return this.defaultContextMenuItems(commands);
  }

  private defaultContextMenuItems = (commands: TableCommands): ContextMenuItem[] => [
    {
      label: "Insert Row Above",
      action: () => commands.insertRowAbove(),
    },
    {
      label: "Insert Row Below",
      action: () => commands.insertRowBelow(),
    },
    {
      label: "Insert Column Left",
      action: () => commands.insertColumnLeft(),
    },
    {
      label: "Insert Column Right",
      action: () => commands.insertColumnRight(),
    },
    {
      separator: true,
      label: "",
      action: () => {},
    },
    {
      label: "Toggle Row Header",
      action: () => commands.toggleRowHeader(),
    },
    {
      label: "Toggle Column Header",
      action: () => commands.toggleColumnHeader(),
    },
    {
      label: "Merge Cells",
      action: () => commands.mergeSelectedCells(),
    },
    {
      label: "Split Cell",
      action: () => commands.unmergeSelectedCell(),
    },
    {
      separator: true,
      label: "",
      action: () => {},
    },
    {
      label: "Delete Row",
      action: () => commands.deleteRow(),
    },
    {
      label: "Delete Column",
      action: () => commands.deleteColumn(),
    },
    {
      label: "Delete Table",
      action: () => commands.deleteTable(),
    },
  ];

  constructor(config?: Partial<TableConfig>) {
    super("table", [ExtensionCategory.Toolbar]);
    this.config = {
      rows: 3,
      columns: 3,
      includeHeaders: false,
      enableContextMenu: true,
      contextMenuItems: this.defaultContextMenuItems,
      ...config,
    };
  }

  configure(config: Partial<TableConfig>): this {
    this.config = { ...this.config, ...config };
    // Merge context menu items if provided
    if (config.contextMenuItems) {
      this.config.contextMenuItems = config.contextMenuItems;
    }
    return this;
  }

  register(editor: LexicalEditor): () => void {
    // Register its markdown transformer with markdown extension
    const mdExtension = this.config.markdownExtension || markdownExtension;
    try {
      mdExtension.registerTransformer?.(TABLE_MARKDOWN_TRANSFORMER as any);
    } catch (e) {
      console.warn('[TableExtension] failed to register table markdown transformer', e);
    }

    // Register our context menu provider if context menu is enabled
    if (this.config.enableContextMenu) {
      const contextMenuExt = this.config.contextMenuExtension || contextMenuExtension;

      if (contextMenuExt) {
        const provider: ContextMenuProvider = {
          id: 'table',
          priority: 10, // Higher priority for tables

          canHandle: ({ target, selection }) => {
            // Check if we're in a table cell
            const tableCell = target.closest('td, th, [data-lexical-table-cell]');
            if (!tableCell) return false;

            // Additional check via selection if needed
            if ($isTableSelection(selection)) return true;

            // Check via DOM
            return tableCell.tagName === 'TD' || tableCell.tagName === 'TH';
          },

          getItems: ({ editor }) => {
            const commands = this.getCommands(editor);
            return this.getContextMenuItems(commands);
          },

          renderer: this.config.contextMenuRenderer || contextMenuExt.config?.defaultRenderer,
        };

        const commands = contextMenuExt.getCommands(editor);
        commands.registerProvider(provider);

        return () => {
          const commands = contextMenuExt.getCommands(editor);
          if (commands) {
            commands.unregisterProvider('table');
          }
        };
      }
    }

    return () => {};
  }

  getNodes(): any[] {
    return [TableNode, TableRowNode, TableCellNode];
  }

  getCommands(editor: LexicalEditor): TableCommands {
    return {
      insertTable: (config: { rows?: number; columns?: number; includeHeaders?: boolean }) => {
        const { rows = 3, columns = 3, includeHeaders = false } = config;

        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const tableNode = $createTableNodeWithDimensions(rows, columns, includeHeaders);
            selection.insertNodes([tableNode]);
          }
        });
      },
      insertRowAbove: () => {
        editor.update(() => {
          $insertTableRowAtSelection(false); // false = insert above
        });
      },
      insertRowBelow: () => {
        editor.update(() => {
          $insertTableRowAtSelection(true); // true = insert below
        });
      },
      insertColumnLeft: () => {
        editor.update(() => {
          $insertTableColumnAtSelection(false); // false = insert left
        });
      },
      insertColumnRight: () => {
        editor.update(() => {
          $insertTableColumnAtSelection(true); // true = insert right
        });
      },
      toggleRowHeader: () => {
        editor.update(() => {
          const activeCell = getSelectedTableCell();
          if (!activeCell) {
            return;
          }

          const tableNode = $getTableNodeFromLexicalNodeOrThrow(activeCell);
          const rowIndex = $getTableRowIndexFromTableCellNode(activeCell);
          const rowNode = tableNode.getChildren()[rowIndex];
          if (!$isTableRowNode(rowNode)) {
            return;
          }

          const rowCells = rowNode.getChildren().filter((node): node is TableCellNode => $isTableCellNode(node));
          const enableHeader = !rowCells.every((cell) => cell.hasHeaderState(TableCellHeaderStates.ROW));
          const nextHeaderState = enableHeader ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS;

          rowCells.forEach((cell) => {
            cell.setHeaderStyles(nextHeaderState, TableCellHeaderStates.ROW);
          });
        });
      },
      toggleColumnHeader: () => {
        editor.update(() => {
          const activeCell = getSelectedTableCell();
          if (!activeCell) {
            return;
          }

          const tableNode = $getTableNodeFromLexicalNodeOrThrow(activeCell);
          const columnIndex = $getTableColumnIndexFromTableCellNode(activeCell);
          const rowNodes = tableNode.getChildren().filter((node): node is TableRowNode => $isTableRowNode(node));

          const columnCells = rowNodes
            .map((rowNode) => rowNode.getChildren()[columnIndex])
            .filter((node): node is TableCellNode => $isTableCellNode(node));

          const enableHeader = !columnCells.every((cell) => cell.hasHeaderState(TableCellHeaderStates.COLUMN));
          const nextHeaderState = enableHeader ? TableCellHeaderStates.COLUMN : TableCellHeaderStates.NO_STATUS;

          columnCells.forEach((cell) => {
            cell.setHeaderStyles(nextHeaderState, TableCellHeaderStates.COLUMN);
          });
        });
      },
      mergeSelectedCells: () => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isTableSelection(selection)) {
            return;
          }

          const cellNodes = selection.getNodes().filter((node): node is TableCellNode => $isTableCellNode(node));
          if (cellNodes.length < 2) {
            return;
          }

          $mergeCells(cellNodes);
        });
      },
      unmergeSelectedCell: () => {
        editor.update(() => {
          $unmergeCell();
        });
      },
      deleteRow: () => {
        editor.update(() => {
          $deleteTableRowAtSelection();
        });
      },
      deleteColumn: () => {
        editor.update(() => {
          $deleteTableColumnAtSelection();
        });
      },
      deleteTable: () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isTableSelection(selection)) {
            selection.getNodes().forEach((node) => {
              if ($isTableNode(node)) {
                node.remove();
              }
            });
          }
        });
      },
      showTableContextMenu: (position: { x: number; y: number }) => {
        // This will be implemented when the extension system allows cross-extension commands
        // For now, this is a placeholder
      },
    };
  }

  getStateQueries(editor: LexicalEditor): TableStateQueries {
    return {
      isTableSelected: async () => {
        return editor.getEditorState().read(() => {
          const selection = $getSelection();
          return $isTableSelection(selection);
        });
      },
      isInTableCell: async () => {
        return editor.getEditorState().read(() => {
          const selection = $getSelection();
          if (!selection || typeof selection !== 'object' || !('anchor' in selection) || !('focus' in selection)) return false;

          try {
            const anchorNode = (selection as any).anchor.getNode();
            const focusNode = (selection as any).focus.getNode();

            return $isTableCellNode(anchorNode) || $isTableCellNode(focusNode);
          } catch {
            return false;
          }
        });
      },
    };
  }

  getPlugins(): ReactNode[] {
    return [<TablePlugin key="table-plugin" />, <TableQuickActionsPlugin key="table-quick-actions-plugin" />];
  }
}

/**
 * Preconfigured Table extension instance.
 * Ready for use in extension arrays.
 */
export const tableExtension = new TableExtension();

/**
 * Table Markdown transformer
 * Supports standard GitHub Flavored Markdown table syntax.
 */
export const TABLE_MARKDOWN_TRANSFORMER = {
  dependencies: [TableNode, TableRowNode, TableCellNode],
  export: (node: any) => {
    if (!$isTableNode(node)) {
      return null;
    }

    const rows = node.getChildren();
    if (rows.length === 0) return null;

    const tableData: string[][] = [];
    rows.forEach((row: any) => {
      if (!$isTableRowNode(row)) {
        return;
      }
      const cells = row.getChildren();
      const rowData: string[] = [];
      cells.forEach((cell: any) => {
        if (!$isTableCellNode(cell)) {
          return;
        }
        const textContent = cell.getTextContent().trim();
        rowData.push(textContent);
      });
      if (rowData.length > 0) tableData.push(rowData);
    });

    if (tableData.length === 0) return null;

    const markdownLines: string[] = [];
    if (tableData[0]) {
      markdownLines.push("| " + tableData[0].join(" | ") + " |");
    }

    const colCount = tableData[0]?.length || 1;
    const separator = "| " + Array(colCount).fill("---").join(" | ") + " |";
    markdownLines.push(separator);

    for (let i = 1; i < tableData.length; i++) {
      const row = tableData[i] || [];
      const paddedRow = [...row];
      while (paddedRow.length < colCount) paddedRow.push("");
      markdownLines.push("| " + paddedRow.join(" | ") + " |");
    }

    return markdownLines.join("\n");
  },
  regExpStart: /^\|.*\|$/,
  regExpEnd: {
    optional: true as const,
    regExp: /^$/
  },
  replace: (rootNode: any, children: any, startMatch: any, endMatch: any, linesInBetween: any, isImport: boolean) => {
    // Combine the start line with lines in between to get all table lines
    const allLines = [startMatch[0], ...(linesInBetween || [])];
    
    // Filter lines that look like table rows
    const tableLines = allLines.filter((line: string) => {
      const trimmed = line.trim();
      return trimmed && trimmed.includes('|') && trimmed.split('|').length > 1;
    });
    
    if (tableLines.length < 2) {
      return;
    }
    
    // Parse the table data
    const rows: string[][] = [];
    tableLines.forEach((line: string) => {
      const cells = line.split('|').slice(1, -1).map((cell: string) => cell.trim());
      if (cells.length > 0) {
        rows.push(cells);
      }
    });
    
    if (rows.length === 0 || !rows[0]) {
      return;
    }
    
    // Filter out separator rows (rows with only dashes and colons)
    const dataRows = rows.filter((row: string[]) => 
      !row.every((cell: string) => /^:?-+:?$/.test(cell))
    );
    
    if (dataRows.length === 0) {
      return;
    }
    
    const tableNode = $createTableNodeWithDimensions(dataRows.length, Math.max(...dataRows.map(r => r.length)), false);
    
    const tableRows = tableNode.getChildren();
    dataRows.forEach((rowData, rowIndex) => {
      const tableRow = tableRows[rowIndex];
      if ($isTableRowNode(tableRow)) {
        const cells = tableRow.getChildren();
        rowData.forEach((cellText, cellIndex) => {
          if (cellIndex < cells.length) {
            const cell = cells[cellIndex];
            if ($isTableCellNode(cell)) {
              cell.clear();
              const paragraph = $createParagraphNode();
              if (cellText) {
                paragraph.append($createTextNode(cellText));
              }
              cell.append(paragraph);
            }
          }
        });
      }
    });
    
    rootNode.append(tableNode);
  },
  type: "multiline-element" as const,
};

