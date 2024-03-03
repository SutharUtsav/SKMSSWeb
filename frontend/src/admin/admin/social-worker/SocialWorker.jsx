import React, { useEffect, useMemo, useState } from 'react'
import useApiCall from '../../../hooks/useApiCall';
import { Link, useNavigate } from 'react-router-dom';
import { del, get } from '../../../service/api-service';
import { MdDelete } from 'react-icons/md';
import { BiEdit, BiSolidUserDetail } from 'react-icons/bi';
import DecisionModal from '../../master/decisionmodal/DecisionModal';
import { EnumConsts } from '../../../consts/EnumConsts';
import TableContainer from "../../master/table/TableContainer";
import DefaultProfileImage from '../../../images/profile.jpg'

const SocialWorker = () => {


  let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
    get("/social-worker")
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
      get("/social-worker")
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
    del("/social-worker", id)
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
      Header: "Social Worker",
      columns: [
        {
          Header: "Id",
          accessor: "userId"
        },
        {
          Header: "Image",
          accessor:"image",
          Cell : (props) => {
            return <img src={props.image ? props.image : DefaultProfileImage} alt='user-profile-image' className='border' style={{
              width:"50px",borderRadius:"50%", aspectRatio:"1", objectFit:"cover"
            }}/>
          }
        }, 
        {
          Header: "Username",
          accessor: "name"
        },
        {
          Header: "Surname",
          accessor: "surname"
        }, {
          Header: "Village",
          accessor: "village"
        },
        {
          Header: "Position",
          accessor: "position"
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
                    <MdDelete
                      fill="#fff"
                      size={"2.5rem"}
                      className="m-1"
                    />
                  </button>
                </div>
              </td>
            )
          }
        }
      ]
    }
  ])


  return (
    <>
      <div className="social-worker content">
        <div className="content-header d-flex flex-row justify-content-between align-items-center">
          <h3 className="fs-1">Social Worker</h3>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item fs-3">
                <Link to="/admin">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active fs-3  " aria-current="page">
                Social Worker
              </li>
            </ol>
          </nav>
        </div>

        <div className="card content-main">
          <div className="card-header content-title">
            <h4>Social Worker</h4>
            {/* <span className="pull-right">
              <button onClick={() => {
                navigate("create")
              }}>Add New</button>
            </span> */}
          </div>



          <div className="card-body content-body">
      
            {data && data.status === 1 ? (
              <TableContainer columns={columns} data={data.data} />
            ) : (
              <>loading</>
            )}

          </div>
        </div>
      </div>
      <DecisionModal onYes={() => {
        handleDelete(deleteRecordId)
      }} deleteRecordId={deleteRecordId} setdeleteRecordId={setdeleteRecordId} topic="Delete Social Worker Position" message="Are you sure you want to delete this Social Worker Position?" />

    </>
  )
}

export default SocialWorker
