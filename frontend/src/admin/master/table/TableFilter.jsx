import React, { useState, useMemo } from 'react'
import { useAsyncDebounce } from 'react-table';
import { BiRefresh } from "react-icons/bi";

// Component for Global Filter
export function GlobalFilter({
    globalFilter,
    setGlobalFilter
}) {
    const [value, setValue] = useState(globalFilter);

    const onChange = useAsyncDebounce((value) => {
        setGlobalFilter(value || undefined);
    }, 200);

    return (

        <div className="row mb-2">
            <div className="input-search col-md-3 offset-md-8">
                <h4 className="box-title">Search</h4>
                <input
                    value={value || ""}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                    className="form-control me-2"
                    // type="search"
                    placeholder="Search"
                    aria-label="Search"
                />
            </div>
            <div className="text-center col-md-1">
                <button className="btn btn-refresh" type="button" onClick={()=>{setValue(""); onChange("")}}>
                    <BiRefresh fill="#fff" size="2.5rem" />
                </button>
            </div>
        </div>
    );
}

// Component for Default Column Filter
export function DefaultFilterForColumn({
    column: {
        filterValue,
        preFilteredRows: { length },
        setFilter,
    },
}) {
    return (
        <input type='search'
            value={filterValue || ""}
            onChange={(e) => {
                // Set undefined to remove the filter entirely
                setFilter(e.target.value || undefined);
            }}
            placeholder={`Search ${length} records..`}
            style={{ marginTop: "10px", fontWeight:"lighter", padding:"3px", fontSize:"1.575rem" }}
        />
    );
}



// // Component for Custom Select Filter
// export function SelectColumnFilter({
//     column: { filterValue, setFilter, preFilteredRows, id },
// }) {

//     // Use preFilteredRows to calculate the options
//     const options = useMemo(() => {
//         const options = new Set();
//         preFilteredRows.forEach((row) => {
//             options.add(row.values[id]);
//         });
//         return [...options.values()];
//     }, [id, preFilteredRows]);

//     // UI for Multi-Select box
//     return (
//         <select
//             value={filterValue}
//             onChange={(e) => {
//                 setFilter(e.target.value || undefined);
//             }}
//         >
//             <option value="">All</option>
//             {options.map((option, i) => (
//                 <option key={i} value={option}>
//                     {option}
//                 </option>
//             ))}
//         </select>
//     );
// }