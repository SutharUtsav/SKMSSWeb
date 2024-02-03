import React, { useEffect, useMemo, useState } from 'react'
import useApiCall from '../../../hooks/useApiCall';
import { del, get } from '../../../service/api-service';
import { Link, useNavigate } from 'react-router-dom';
import { BiRefresh, BiSolidUserDetail } from "react-icons/bi";
import { EnumConsts } from '../../../consts/EnumConsts';
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import DecisionModal from '../../master/decisionmodal/DecisionModal';
import TableContainer from '../../master/table/TableContainer';

const Event = () => {

    let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
        get("/event")
    );

    const [isReloadData, setisReloadData] = useState(false);
    const [deleteRecordId, setdeleteRecordId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            setdeleteRecordId(null);
        }
    }, [])


    //Reload Data on isReloadData is true
    useEffect(() => {
        if (isReloadData) {
            get("/event")
                .then((response) => {
                    // console.log(response);
                    if (response.data.status === 1) {
                        setData(response.data);
                    } else {
                        setError(response.data.error);
                    }
                })
                .catch((err) => {
                    error = err;
                })
                .finally(() => {
                    setisReloadData(false);
                });
        }
    }, [isReloadData]);


    //Delete Api Call
    const handleDelete = (id) => {
        console.log(id);
        del("/event", id)
            .then((response) => {
                if (response && response.data.status === 1) {
                    setisReloadData(true);
                }
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };


    const columns = useMemo(() => [
        {
            Header: "Event",
            columns: [
                {
                    Header: "Id",
                    accessor: "id"
                },
                {
                    Header: "Title",
                    accessor: "title"
                },
                {
                    Header: "Description",
                    accessor: "description"
                },
                {
                    Header: "EventDate",
                    accessor: "eventOn"
                },
                {
                    Header: "Action",
                    Cell: (props) => {
                        return (
                            <td aria-colindex="5" data-label="Actions" role="cell">
                                <div className="action-btns">
                                    <button
                                        title=" Preview or Upload More Images"
                                        className="btn btn-sm btn-success"
                                        onClick={() => {
                                            navigate(`/admin/events/details/${props.id}`)
                                        }}
                                    >
                                        <FaEye
                                            fill="#fff"
                                            size={"2.5rem"}
                                            className="m-1"
                                        />
                                    </button>
                                    <button
                                        title="Edit"
                                        className="btn btn-sm btn-primary btn-edit"
                                        onClick={() => {
                                            navigate(`/admin/events/edit/${props.id}`)
                                        }}
                                    >
                                        <BiEdit fill="#fff" size={"2.5rem"} className="m-1" />
                                    </button>
                                    <button
                                        title="Delete"
                                        className="btn btn-sm btn-danger btn-delete"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#${EnumConsts.DECISIONMODALID}`}
                                        onClick={() => {
                                            setdeleteRecordId(props.id);
                                        }}
                                    >
                                        <MdDelete fill="#fff" size={"2.5rem"} className="m-1" />
                                    </button>
                                </div>
                            </td>
                        )
                    }
                },
            ]
        }
    ])

    return (
        <>
            <div className="events content">
                <div className="content-header d-flex flex-row justify-content-between align-items-center">
                    <h3 className="fs-1">Event</h3>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item fs-3">
                                <Link to="/admin">Dashboard</Link>
                            </li>
                            <li className="breadcrumb-item active fs-3  " aria-current="page">
                                Event
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="card content-main">
                    <div className="card-header content-title">
                        <h4>Event</h4>
                        <span className="pull-right">
                            <button onClick={() => {
                                navigate("create")
                            }}>Add New</button>
                        </span>
                    </div>

                    <div className="card-body content-body">
                        {/* <div className="row mb-2">
                            <div className="input-search col-md-3 offset-md-8">
                                <h4 className="box-title">Search</h4>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                />
                            </div>
                            <div className="text-center col-md-1">
                                <button className="btn btn-refresh" type="submit">
                                    <BiRefresh fill="#fff" size="2.5rem" />
                                </button>
                            </div>
                        </div> */}

                        {data && data.status === 1 ? (
                            <TableContainer columns={columns} data={data.data} />
                        ) : (
                            <>loading</>
                        )}

                        {/* {data && data.status === 1 ? (
                            <div className="table-responsive mt-5">
                                <table
                                    role="table"
                                    aria-busy="false"
                                    aria-colcount="3"
                                    className="table b-table table-bordered table-sm b-table-stacked-md"
                                >
                                    <thead role="rowgroup" className="">
                                        <tr role="row" className="">
                                            <th
                                                className="position-relative text-center"
                                                role="columnheader"
                                                scope="col"
                                                tabIndex="0"
                                                aria-colindex="1"
                                                aria-sort="none"
                                            >
                                                <div>ID</div>
                                            </th>

                                            <th
                                                className="position-relative text-center"
                                                role="columnheader"
                                                scope="col"
                                                tabIndex="0"
                                                aria-colindex="2"
                                                aria-sort="none"
                                            >
                                                <div>Title</div>
                                            </th>

                                            <th
                                                className="position-relative text-center"
                                                role="columnheader"
                                                scope="col"
                                                tabIndex="0"
                                                aria-colindex="3"
                                                aria-sort="none"
                                            >
                                                <div>Discription</div>
                                            </th>

                                            <th
                                                className="position-relative text-center"
                                                role="columnheader"
                                                scope="col"
                                                tabIndex="0"
                                                aria-colindex="3"
                                                aria-sort="none"
                                            >
                                                <div>Event Date</div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody role="rowgroup">
                                        {data.data.map((event, index) => (
                                            <tr role="row" aria-rowindex="1" className="" key={index}>
                                                <td
                                                    aria-colindex="1"
                                                    data-label="ID"
                                                    role="cell"
                                                    className="text-center"
                                                >
                                                    <div>{index + 1}</div>
                                                </td>

                                                <td className="text-center">{event.title}</td>
                                                <td className="text-center">{event.description}</td>
                                                <td className="text-center">{event.eventOn}</td>

                                                <td aria-colindex="5" data-label="Actions" role="cell">
                                                    <div className="action-btns">
                                                        <button
                                                            title=" Preview or Upload More Images"
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => {
                                                                navigate(`/admin/events/details/${event.id}`)
                                                            }}
                                                        >
                                                            <FaEye
                                                                fill="#fff"
                                                                size={"2.5rem"}
                                                                className="m-1"
                                                            />
                                                        </button>
                                                        <button
                                                            title="Edit"
                                                            className="btn btn-sm btn-primary btn-edit"
                                                            onClick={() => {
                                                                navigate(`/admin/events/edit/${event.id}`)
                                                            }}
                                                        >
                                                            <BiEdit fill="#fff" size={"2.5rem"} className="m-1" />
                                                        </button>
                                                        <button
                                                            title="Delete"
                                                            className="btn btn-sm btn-danger btn-delete"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#${EnumConsts.DECISIONMODALID}`}
                                                            onClick={() => {
                                                                setdeleteRecordId(event.id);
                                                            }}
                                                        >
                                                            <MdDelete fill="#fff" size={"2.5rem"} className="m-1" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <>loading</>
                        )} */}
                    </div>

                </div>
            </div>

            <DecisionModal onYes={() => {
                handleDelete(deleteRecordId)
            }} deleteRecordId={deleteRecordId} setdeleteRecordId={setdeleteRecordId} topic="Delete Event" message="Are you sure you want to delete this Event?" />
        </>
    )
}

export default Event
