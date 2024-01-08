import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { del, get } from "../../../service/api-service";
import { BiRefresh } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { FaUpload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useApiCall from "../../../hooks/useApiCall";
import DecisionModal from "../../master/decisionmodal/DecisionModal";
import { EnumConsts } from "../../../consts/EnumConsts";

const Family = () => {
  let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
    get("/family")
  );

  const navigate = useNavigate();

  const [isReloadData, setisReloadData] = useState(false);
  const [deleteRecordId, setdeleteRecordId] = useState(null);

  useEffect(() => {
    return () => {
      setdeleteRecordId(null);
    }
  }, [])

  //Reload Data on isReloadData is true
  useEffect(() => {
    if (isReloadData) {
      get("/family")
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
    del("/family", id)
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
          <h3 className="fs-1">Family</h3>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item fs-3">
                <Link to="/admin">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active fs-3  " aria-current="page">
                Family
              </li>
            </ol>
          </nav>
        </div>

        <div className="card content-main">
          <div className="card-header content-title">
            <h4>Family</h4>
            <span className="pull-right">
              <button onClick={() => {
                navigate("create")
              }}>Add New</button>
            </span>
          </div>

          <div className="card-body content-body">
            <div className="row mb-2">
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
            </div>

            {/* <div className="bulk-upload-menu">
            <h4>Bulk Upload</h4>
            <p>Family Bulk Upload Form</p>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="upload_file">Excel File</label>
                  <input type="file" name="upload_file" id="upload_file" required="required" accept=".xls, .xlsx" className="form-control" onChange={(e)=>{
                    console.log(e.ta)
                  }}/>
                </div>
              </div>
              <div className="col-md-12">
                <button type="submit" className="btn" name='btnAdd' id="submit_btn"> <FaUpload fill="#fff"/> Upload</button>
              </div>
            </div>
          </div> */}

            {data && data.status === 1 ? (
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
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnheader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="2"
                        aria-sort="none"
                      >
                        <div>Surname</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnheader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="3"
                        aria-sort="none"
                      >
                        <div>Village</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnheader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="3"
                        aria-sort="none"
                      >
                        <div>Village (ગુજરાતીમાં)</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnhedader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="4"
                        aria-sort="none"
                      >
                        <div>Current Residency</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnhedader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="4"
                        aria-sort="none"
                      >
                        <div>Devsthan</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnhedader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="4"
                        aria-sort="none"
                      >
                        <div>Kuldevi</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>


                      <th
                        className="position-relative"
                        role="columnheader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="5"
                        aria-sort="none"
                      >
                        <div>Gautra</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative"
                        role="columnheader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="5"
                        aria-sort="none"
                      >
                        <div>Residency Address</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative"
                        role="columnheader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="5"
                        aria-sort="none"
                      >
                        <div>Main Family Member Fullname</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative"
                        role="columnheader"
                        scope="col"
                        tabIndex="0"
                        aria-colindex="5"
                        aria-sort="none"
                      >
                        <div>Action</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>
                    </tr>
                  </thead>

                  <tbody role="rowgroup">
                    {data.data.map((family, index) => (
                      <tr role="row" aria-rowindex="1" className="" key={index}>
                        <td
                          aria-colindex="1"
                          data-label="ID"
                          role="cell"
                          className="text-center"
                        >
                          <div>{index + 1}</div>
                        </td>

                        <td className="text-center">{family.surname}</td>
                        <td className="text-center">{family.village}</td>
                        <td className="text-center">{family.villageGuj}</td>
                        <td className="text-center">{family.currResidency}</td>
                        <td className="text-center">{family.adobeOfGod}</td>
                        <td className="text-center">{family.goddess}</td>
                        <td className="text-center">{family.lineage}</td>
                        <td className="text-center">{family.residencyAddress}</td>
                        <td className="text-center">{family.mainFamilyMemberName}</td>

                        <td aria-colindex="5" data-label="Actions" role="cell">
                          <div className="action-btns">
                            <button
                              title="Edit"
                              className="btn btn-sm btn-primary btn-edit"
                              onClick={() => {
                                navigate(`/admin/families/edit/${family.id}`)
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
                                setdeleteRecordId(family.id);
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
            )}

          </div>
        </div>
      </div>
      <DecisionModal onYes={() => {
        handleDelete(deleteRecordId)
      }} deleteRecordId={deleteRecordId} setdeleteRecordId={setdeleteRecordId} topic="Delete User" message="Are you sure you want to delete this User?" />

    </>
  );
};

export default Family;
