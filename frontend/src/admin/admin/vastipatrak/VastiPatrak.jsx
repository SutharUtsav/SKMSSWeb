import React, { useEffect, useMemo, useState } from 'react'
import useApiCall from '../../../hooks/useApiCall';
import TableContainer from '../../master/table/TableContainer';
import { Link } from 'react-router-dom';
import { get, getByQueryParams } from '../../../service/api-service';
import { FaEye } from "react-icons/fa";
import ViewTemplateModal from './ViewTemplateModal';

const VastiPatrak = () => {
    let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
        get("/vastipatrak")
    );

    const [fileContentDict, setFileContentDict] = useState({});
    const [viewTempate, setviewTempate] = useState(null)
    const [selectedTempate, setselectedTempate] = useState(null)

    useEffect(() => {
        get("/vastipatrak/get-template")
            .then((response) => {
                if (response.data.status === 1) {
                    setFileContentDict(response.data.data);
                }
                else {
                    console.log(response)
                    setFileContentDict({});

                }
            })
            .catch((error) => {
                setFileContentDict({});
                console.log(error)
            })
            .finally(() => {
                setselectedTempate(null)
            })
    }, [])


    const columns = useMemo(() => [
        {
            Header: "VastiPatrak",
            columns: [
                {
                    Header: "Id",
                    accessor: "id"
                },
                {
                    Header: "Member No",
                    accessor: "kutumb_member_no"
                },
                {
                    Header: "Kutumb No",
                    accessor: "kutumb_no"
                },
                {
                    Header: "Village No",
                    accessor: "village_no"
                },
                {
                    Header: "Kutumb Members",
                    accessor: "kutumb_members"
                },
                {
                    Header: "Village",
                    accessor: "village"
                },
                {
                    Header: "Village (ગુજરાતીમાં)",
                    accessor: "villageGuj"
                },
                {
                    Header: "CurrentResidency",
                    accessor: "currResidency"
                },
                {
                    Header: "Main Family Member Name",
                    accessor: "mainFamilyMemberName"
                },
                {
                    Header: "Devsthan",
                    accessor: "abode_of_God"
                },
                {
                    Header: "Surname",
                    accessor: "surname"
                },
                {
                    Header: "Kuldevi",
                    accessor: "goddess"
                },
                {
                    Header: "Gautra",
                    accessor: "lineage"
                },
                {
                    Header: "Residency Address",
                    accessor: "Residency_Address"
                },
                {
                    Header: "Name",
                    accessor: "name"
                },
                {
                    Header: "Mobile Number",
                    accessor: "mobileNumber"
                },
                {
                    Header: "Main Family Member Relation",
                    accessor: "mainFamilyMemberRelation"
                },
                {
                    Header: "Married",
                    accessor: "married"
                },
                {
                    Header: "Birthdate",
                    accessor: "birthdate"
                },
                {
                    Header: "Education",
                    accessor: "education"
                },
                {
                    Header: "Occupation",
                    accessor: "occupation"
                },
                {
                    Header: "Email",
                    accessor: "email"
                },
                {
                    Header: "Mother Name",
                    accessor: "motherName"
                },
                {
                    Header: "Father Name",
                    accessor: "fatherName"
                },
            ]
        }
    ])


    const handleGenerateVastiPatrak = (e) => {
        e.preventDefault();

        if (!selectedTempate) {
            console.log("Template is not selected")
        }
        else {
            const queryJson = {
                templateFileName: selectedTempate,
            };

            getByQueryParams("/vastipatrak/generate", queryJson)
            .then((response)=> {
                if(response.data.status === 1){
                    console.log(response.data)
                }
                else{
                    console.log(response.data)
                }
            })
            .catch((error)=>{
                console.log(error)
            })
            .finally(()=>{
                setselectedTempate(null);
                setviewTempate(null);
            })
        }
    }
    return (
        <>
            <div className="vastipatrak content">
                <div className="content-header d-flex flex-row justify-content-between align-items-center">
                    <h3 className="fs-1">VastiPatrak</h3>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item fs-3">
                                <Link to="/admin">Dashboard</Link>
                            </li>
                            <li className="breadcrumb-item active fs-3  " aria-current="page">
                                VastiPatrak
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className="card content-main">
                    <form onSubmit={handleGenerateVastiPatrak}>
                        <div className="card-header content-title">
                            <h4>VastiPatrak</h4>
                            <span className="pull-right">
                                <button type='submit' disabled={!selectedTempate}>Generate PDF</button>
                            </span>
                        </div>

                        <div className="content-title border-top" style={{ marginTop: "50px", marginBottom: "30px" }}>
                            <span className="pull-right my-4">
                                <button disabled>Add Template</button>
                            </span>

                            <div className='d-flex gap-5' style={{ marginTop: "60px" }}>
                                {Object.entries(fileContentDict).map(([fileName, fileContent], index) => (
                                    <div className='d-flex flex-column align-items-center form-check' style={{
                                        position: "relative"
                                    }}>
                                        <input className="form-check-input my-3 fs-2" type="radio" name="templateRadio" onChange={()=>{setselectedTempate(fileName)}} />
                                        <button id={`view-btn${index}`} style={{
                                            position: "absolute",
                                            top: "35px",
                                            right: "5px",
                                            height: "30px",
                                            width: "30px",
                                            borderRadius: "50%",
                                            padding: "8px",
                                            background: "var(--secondary-color)",
                                            display: "flex",
                                            alignItems: "center"
                                        }} className="shadow" data-bs-toggle="modal" data-bs-target="#TemplateViewModal" onClick={() => {
                                            setviewTempate(fileContent)
                                        }}><FaEye fill='var(--body-background)' fontSize={"2rem"} /></button>
                                        <div style={{
                                            width: "200px",
                                            height: "200px",
                                            overflow: "hidden",
                                            padding: "5px",
                                            border: "1px solid #ddd",
                                            borderRadius: "8px"
                                        }}>
                                            <div dangerouslySetInnerHTML={{ __html: fileContent }} style={{
                                                width: "100%",
                                                height: "100%",
                                            }}></div>
                                        </div>
                                        <span className='fs-3 fw-light mt-3' style={{ textTransform: "none" }}>{fileName}</span>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </form>

                    <div className="card-body content-body mt-4 border-top">
                        {data && data.status === 1 ? (
                            <TableContainer columns={columns} data={data.data} />
                        ) : (
                            <>loading</>
                        )}
                    </div>

                </div>
            </div>

            <ViewTemplateModal content={viewTempate} />
        </>
    )
}

export default VastiPatrak
