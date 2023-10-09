import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../../service/api-service";
import { BiRefresh } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import useApiCall from "../../../hooks/useApiCall";
import CreateFamily from "./CreateFamily";
const Family = () => {
  let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
    get("/family")
  );

  const navigate = useNavigate();

  const [isUpdateClicked, setisUpdateClicked] = useState(false)
  const [beforeUpdateData, setbeforeUpdateData] = useState(null)

  useEffect(() => {
    setisUpdateClicked(false)
    return () => {
      setisUpdateClicked(false)
    }
  }, [])

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
                                setbeforeUpdateData(family);
                                setisUpdateClicked(true)
                              }}
                            >
                              <BiEdit fill="#fff" size={"2.5rem"} className="m-1" />
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-sm btn-danger btn-delete"
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
      {!isUpdateClicked ? null : (
        <CreateFamily beforeUpdateData={beforeUpdateData} setbeforeUpdateData={setbeforeUpdateData} setisUpdateClicked={setisUpdateClicked}/>
      )}
    </>
  );
};

export default Family;
