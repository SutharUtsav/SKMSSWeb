import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import OccupiedCalender from '../../../components/SamajWadi/OccupiedCalender'
import { zeroPad } from '../../../hooks/textTransform'
import { del, get, getByQueryParams, post } from '../../../service/api-service'
import useApiCall from '../../../hooks/useApiCall'
import { EnumConsts } from '../../../consts/EnumConsts'
import DecisionModal from '../../master/decisionmodal/DecisionModal'
import { MdDelete } from "react-icons/md";
import TableContainer from '../../master/table/TableContainer'

const SamajWadiOccupied = () => {
    const defaultOccupiedCalendarForm = {
        fromDate: new Date(),
        toDate: new Date(),
        isOccupied: true,
        eventTitle: "",
        eventDescription: "",
        fair: 0,
        totalDays: 1
    }

    const date = new Date();
    const jsonForm = {
        month: date.getMonth() + 1,
        year: date.getFullYear()
    }
    let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
        getByQueryParams("/samajwadi-occupied", jsonForm)
    );



    const [occupiedForm, setoccupiedForm] = useState(defaultOccupiedCalendarForm)
    const [fromTime, setfromTime] = useState("")
    const [toTime, settoTime] = useState("")
    const [isReloadData, setisReloadData] = useState(false);
    const [deleteRecordId, setdeleteRecordId] = useState(null);
    
    const columns = useMemo(() => [
        {
            Header: "Samaj Wadi Occupied Events List",
            columns: [
                {
                    Header: "Id",
                    accessor: "id"
                }, {
                    Header: "Event Title",
                    accessor: "eventTitle"
                },
                {
                    Header: "Event Desciption",
                    accessor: "eventDescription"
                },
                {
                    Header: "From Date",
                    accessor: "fromDate"
                },
                {
                    Header: "To Date",
                    accessor: "toDate"
                },
                {
                    Header: "Fair",
                    accessor: "fair"
                },
                {
                    Header: "Total Days",
                    accessor: "totalDays"
                },
                {
                    Header: "Action",
                    Cell: (props) => {
                        return (
                            <td aria-colindex="5" data-label="Actions" role="cell">
                                <div className="action-btns">
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
                }
            ]
        }
    ])

    //Reload Data on isReloadData is true
    useEffect(() => {
        if (isReloadData) {
            const date = occupiedForm.fromDate;
            const jsonForm = {
                month: date.getMonth() + 1,
                year: date.getFullYear()
            }
            getByQueryParams("/samajwadi-occupied", jsonForm)
                .then((response) => {
                    // console.log(response);
                    if (response.data.status === 1) {
                        setData(response.data);
                    } else {
                        if (response.data.error?.errorMsg === "No Data Found!") {
                            setData([]);
                        }
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

    useEffect(() => {
        return () => {
            setdeleteRecordId(null);
        }
    }, [])

    const handleSubmitEvent = (e) => {
        e.preventDefault();

        if (!occupiedForm.eventTitle || occupiedForm.eventTitle === "") {
            console.log("Event title is empty");
        }
        else if (!occupiedForm.eventDescription || occupiedForm.eventDescription === "") {
            console.log("Event description is empty");
        }
        else if (!occupiedForm.fair) {
            console.log("Event fair is empty");
        }
        else if (!occupiedForm.fromDate) {
            console.log("Event fromDate is empty");
        }
        else if (!occupiedForm.toDate) {
            console.log("Event toDate is empty");
        }
        else if (!occupiedForm.totalDays) {
            console.log("Event totalDays is empty");
        }
        else {

            // console.log(occupiedForm.fromDate)
            // console.log(occupiedForm.toDate)
            // console.log(fromTime)
            // console.log(toTime)


            const fromDate = new Date(occupiedForm.fromDate);
            fromDate.setHours(fromTime.split(":")[0]);
            fromDate.setMinutes(fromTime.split(":")[1]);
            const toDate = new Date(occupiedForm.toDate);
            toDate.setHours(toTime.split(":")[0]);
            toDate.setMinutes(toTime.split(":")[1]);

            setoccupiedForm({
                ...occupiedForm,
                fromDate: fromDate,
                toDate: toDate
            })

            post("/samajwadi-occupied", { ...occupiedForm, fromDate: fromDate, toDate: toDate })
                .then((response) => {
                    if (response.data.status === 1) {
                        console.log(response.data)
                    }
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setoccupiedForm(defaultOccupiedCalendarForm)
                    setfromTime("");
                    settoTime("");
                    setisReloadData(true)
                });

        }
    }

    const setDates = (_fromDate, _toDate) => {
        const fromDate = new Date(_fromDate);
        const toDate = new Date(_toDate);

        setfromTime(`${zeroPad(fromDate.getHours(), 2)}:${zeroPad(fromDate.getMinutes(), 2)}`);
        settoTime(`${zeroPad(toDate.getHours(), 2)}:${zeroPad(toDate.getMinutes(), 2)}`);

        const totalTime = toDate.getTime() - fromDate.getTime();
        const totalDays = Math.floor(totalTime / (24 * 60 * 60 * 1000)) + 1

        setoccupiedForm({
            ...occupiedForm,
            fromDate: fromDate,
            toDate: toDate,
            totalDays: totalDays
        })

        setisReloadData(true)
    }

    const handleResetForm = () => {
        setoccupiedForm(defaultOccupiedCalendarForm)
        setfromTime("")
        settoTime("")
    };

    const handleChange = (e) => {
        setoccupiedForm({
            ...occupiedForm,
            [e.target.name]: e.target.value,
        });
    };

    //Delete Api Call
    const handleDelete = (id) => {
        console.log(id);
        del("/samajwadi-occupied", id)
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

    return (
        <>
            <div className="families content">
                <div className="content-header d-flex flex-row justify-content-between align-items-center">
                    <h3 className="fs-1">Samajwadi Occupied</h3>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item fs-3">
                                <Link to="/admin">Dashboard</Link>
                            </li>
                            <li className="breadcrumb-item active fs-3  " aria-current="page">
                                Samajwadi Occupied
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="card content-main">
                    <div className="card-header content-title">
                        <h4 style={{ textAlign: "center", marginTop: "8px", marginBottom: "8px", textTransform: "none" }}>Upload Events where Samajwadi will be Occupied:</h4>
                    </div>

                    <div className="card-body content-body create-form-page">
                        <label className="fs-2 fw-normal">
                            <span className=" text-danger me-2 fs-2">*</span>
                            Required Fields
                        </label>

                        <form className="row mt-5 gx-5 gy-5" onSubmit={handleSubmitEvent}>

                            <div className="col-md-6">
                                <label htmlFor="">Select Event Dates:</label>
                                <i className="text-danger">*</i>
                            </div>
                            <OccupiedCalender enableSelection={true} setDates={setDates} />

                            <div className="col-md-6">
                                <label htmlFor="fromDateTime">Select From which Time (કયા સમયથી)</label>
                                <i className="text-danger">*</i>
                                <input
                                    id="fromDateTime"
                                    type="time"
                                    name="fromTime"
                                    placeholder="Enter From which Time"
                                    className="form-control"
                                    required={true}
                                    value={fromTime}
                                    onChange={(e) => {
                                        setfromTime(e.target.value)
                                    }}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="toDateTime">Select To which Time (કયા સમય સુધી)</label>
                                <i className="text-danger">*</i>
                                <input
                                    id="toDateTime"
                                    type="time"
                                    name="toTime"
                                    placeholder="Enter To which Time"
                                    className="form-control"
                                    required={true}
                                    value={toTime}
                                    onChange={(e) => {
                                        settoTime(e.target.value)
                                    }}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="eventInputTitle">Event Title</label>
                                <i className="text-danger">*</i>
                                <input
                                    id="eventInputTitle"
                                    type="text"
                                    name="eventTitle"
                                    placeholder="Enter Event Title"
                                    className="form-control"
                                    required={true}
                                    value={occupiedForm.eventTitle}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="eventInputDescription">Event Description</label>
                                <i className="text-danger">*</i>
                                <textarea
                                    id="eventInputDescription"
                                    type="text"
                                    name="eventDescription"
                                    placeholder="Enter Event Description"
                                    className="form-control"
                                    required={true}
                                    value={occupiedForm.eventDescription}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="fairInput">Fair</label>
                                <i className="text-danger">*</i>
                                <input
                                    id="fairInput"
                                    type="number"
                                    name="fair"
                                    placeholder="Enter Fair"
                                    className="form-control"
                                    required={true}
                                    value={occupiedForm.fair}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="totalDaysInput">Total Days</label>
                                <i className="text-danger">*</i>
                                <input
                                    id="totalDaysInput"
                                    type="number"
                                    name="fair"
                                    placeholder="Enter Total Amount"
                                    className="form-control"
                                    required={true}
                                    value={occupiedForm.totalDays}
                                    disabled={true}
                                // onChange={handleChange}
                                />
                            </div>

                            <div className="float-end mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-save m-2 px-4 py-2 fs-3 fw-normal rounded"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary m-2 px-4 py-2 fs-3 fw-normal rounded"
                                    data-bs-dismiss="modal"
                                    onClick={handleResetForm}
                                >
                                    Cancel
                                </button>
                            </div>

                        </form>

                        <div className='border-top py-5 mt-5'>
                            <div className="content-title">
                                <h4 style={{ textAlign: "center", marginTop: "8px", marginBottom: "8px", textTransform: "none" }}>SamajWadi Occupied Events List:</h4>
                            </div>
                            {data && data.status === 1 ? (
                                <TableContainer columns={columns} data={data.data} />
                            ) : (
                                <>loading</>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <DecisionModal onYes={() => {
                handleDelete(deleteRecordId)
            }} deleteRecordId={deleteRecordId} setdeleteRecordId={setdeleteRecordId} topic="Delete Event" message="Are you sure you want to delete this Event?" />

        </>
    )
}

export default SamajWadiOccupied
