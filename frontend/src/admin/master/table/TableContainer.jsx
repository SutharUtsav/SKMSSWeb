import React, { useEffect } from 'react'
import { useTable, useFilters, useGlobalFilter } from "react-table";
import { DefaultFilterForColumn, GlobalFilter } from './TableFilter';

const TableContainer = ({ columns, data }) => {
    // useEffect(() => {
    //     console.log(columns)
    //     console.log(data)
    // }, [columns, data])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        state,
        visibleColumns,
        prepareRow,
        setGlobalFilter,
        preGlobalFilteredRows,
    } = useTable({
        columns,
        data,
        defaultColumn: { Filter: DefaultFilterForColumn },
    },
        useFilters,
        useGlobalFilter)

    // useEffect(() => {
    //     console.log(headerGroups)
    //     console.log(rows)
    // }, [headerGroups, rows])
    return (
        <>
            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            {headerGroups && rows ? (
                <div className="table-responsive mt-5">
                    <table {...getTableProps()} role="table"
                        aria-busy="false"
                        aria-colcount="3"
                        className="table b-table table-bordered table-sm b-table-stacked-md">
                        <thead role="rowgroup" className="">
                            {headerGroups.map((headerGroup, index1) => (
                                <>
                                    {index1 === 1 ? (
                                        <tr {...headerGroup.getHeaderGroupProps()} role="row" className="">
                                            {headerGroup.headers.map((column, index2) => (
                                                <>
                                                    {index2 ? (
                                                        <th {...column.getHeaderProps()} className="position-relative text-center"
                                                            role="columnheader"
                                                            scope="col"
                                                            tabIndex="0"
                                                            aria-colindex="1"
                                                            aria-sort="none">
                                                            <div>{column.render('Header')}</div>
                                                            <div>
                                                                {column.canFilter ? column.render("Filter")
                                                                    : null}
                                                            </div>
                                                        </th>
                                                    ) : null}
                                                </>
                                            ))}
                                        </tr>
                                    ) : null}
                                </>
                            ))}
                        </thead>
                        <tbody role="rowgroup" {...getTableBodyProps()} >
                            {rows.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <tr role="row" aria-rowindex="1" className="" key={i} {...row.getRowProps()} >
                                        {row.cells.map((cell, ind) => {
                                            return (
                                                <>
                                                    {ind != 0 ? (
                                                        <>
                                                            {cell.column.Header === "Action" ? (
                                                                <td {...cell.getCellProps()} aria-colindex="1"
                                                                    role="cell"
                                                                    className="text-center">{cell.render('Cell', { id: row.cells[0].value })}
                                                                </td>
                                                            ) : (
                                                                <td {...cell.getCellProps()} aria-colindex="1"
                                                                    role="cell"
                                                                    className="text-center" style={{textTransform:"none"}}>{cell.render('Cell')}
                                                                </td>
                                                            )}
                                                        </>
                                                    ) : null}
                                                </>)
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </>
    )
}

export default TableContainer
