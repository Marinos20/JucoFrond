import React, { useState, useEffect } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function DataTable({
  columns,
  data,
  filterPlaceholder = 'Rechercher...',
  searchColumn = 'last_name',
  onSelectionChange,
  rowSelection: externalRowSelection,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState(
    externalRowSelection || {}
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater(rowSelection)
          : updater;

      setRowSelection(next);
      if (onSelectionChange) onSelectionChange(next);
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // Synchronisation avec une sélection externe
  useEffect(() => {
    if (externalRowSelection) {
      setRowSelection(externalRowSelection);
    }
  }, [externalRowSelection]);

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            placeholder={filterPlaceholder}
            value={table.getColumn(searchColumn)?.getFilterValue() || ''}
            onChange={(e) =>
              table
                .getColumn(searchColumn)
                ?.setFilterValue(e.target.value)
            }
            className="h-12 w-full pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200 font-bold h-12 px-6 hover:bg-slate-50"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtres avancés
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-slate-50 bg-slate-50/30"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-slate-400"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'transition-all duration-300',
                    row.getIsSelected()
                      ? 'bg-indigo-50/30'
                      : 'hover:bg-slate-50/50'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center text-slate-300 font-bold italic"
                >
                  Aucun élève ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          {table.getFilteredSelectedRowModel().rows.length} ligne(s)
          sélectionnée(s) sur{' '}
          {table.getFilteredRowModel().rows.length}
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Affichage
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) =>
                table.setPageSize(Number(e.target.value))
              }
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black outline-none focus:border-indigo-500 cursor-pointer"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} par page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 w-9 p-0 rounded-xl border-slate-200"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-xs font-black px-3 text-slate-900">
              Page {table.getState().pagination.pageIndex + 1} /{' '}
              {table.getPageCount()}
            </span>

            <Button
              variant="outline"
              className="h-9 w-9 p-0 rounded-xl border-slate-200"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
