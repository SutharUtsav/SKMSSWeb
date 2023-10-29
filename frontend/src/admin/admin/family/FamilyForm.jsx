import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { add, edit, get } from "../../../service/api-service";

const FamilyForm = (props) => {
  const navigate = useNavigate();
  const params  = useParams();
  const familyId = params.id;

  const defaultFamilyForm = {
    surname: "",
    village: "",
    villageGuj: "",
    currResidency: "",
    adobeOfGod: "",
    goddess: "",
    lineage: "",
    residencyAddress: "",
    mainFamilyMemberName: "",
  };

  const [familyForm, setfamilyForm] = useState(defaultFamilyForm);

  useEffect(() => {
    if (familyId) {
      get(`/family/${familyId}`)
      .then((response)=> {
        if(response.data.status === 1){
          const family = response.data.data;
          setfamilyForm({
            surname : family.surname ? family.surname : "",
            village : family.village ? family.village : "",
            villageGuj : family.villageGuj ? family.villageGuj : "",
            currResidency : family.currResidency ? family.currResidency : "",
            adobeOfGod : family.adobeOfGod ? family.adobeOfGod : "",
            goddess : family.goddess ? family.goddess : "",
            lineage : family.lineage ? family.lineage : "",
            residencyAddress : family.residencyAddress ? family.residencyAddress : "",
            mainFamilyMemberName : family.mainFamilyMemberName ? family.mainFamilyMemberName : ""
          })
        }
        console.log(response.data.data)
      })
      .catch((error)=> {
        console.log(error)
      })
    }

    return () => {
      setfamilyForm(defaultFamilyForm);
    };
  }, [familyId]);

  const handleResetForm = () => {
    setfamilyForm(defaultFamilyForm);
  };

  const handleChange = (e) => {
    setfamilyForm({
      ...familyForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();


    if(!familyForm.surname || familyForm.surname === ""){
      console.log("Surname is required")
    }
    else if(!familyForm.village || familyForm.village === ""){
      console.log("Village is required")
    }
    else if(!familyForm.villageGuj || familyForm.villageGuj === ""){
      console.log("VillageGuj is required")
    }
    else if(!familyForm.mainFamilyMemberName || familyForm.mainFamilyMemberName === ""){
      console.log("Main Family Member Name is required")
    }
    else{
      if (!familyId) {
        add("/family", familyForm)
          .then((response) => {
            // if(response.data.status === 1){
  
            // }
            if (props.setisReloadData) {
              props.setisReloadData(true);
            }
            console.log(response);
            navigate("/admin/families")
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setfamilyForm(defaultFamilyForm);
          });
      } else {
        edit("/family", familyId, familyForm)
          .then((response) => {
            if (response.data.status === 1) {
              if(props.setisUpdateClicked){
                  props.setisUpdateClicked(false)
              }
              if(props.setisReloadData){
                  props.setisReloadData(true)
              }
            }
            console.log(response);
            navigate("/admin/families")
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setfamilyForm(defaultFamilyForm);
          });
      }
    }
  };

  return (
    <div className="families content">
      <div className="content-header d-flex flex-row justify-content-between align-items-center">
        <h3 className="fs-1">
          {props.beforeUpdateData ? "update" : "crate"} Family
        </h3>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fs-3">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item fs-3">
              <Link to="/admin/families">Family</Link>
            </li>
            <li className="breadcrumb-item active fs-3  " aria-current="page">
              {props.beforeUpdateData ? "update" : "crate"} Family
            </li>
          </ol>
        </nav>
      </div>

      <div className="card content-main">
        <div className="card-header content-title">
          <h4>New Family</h4>
          <span className="pull-right">
            <button
              onClick={() => {
                if (props.setisUpdateClicked) {
                  props.setisUpdateClicked(false);
                  props.setbeforeUpdateData(null);
                } else {
                  navigate("/admin/families");
                }
              }}
            >
              Manage Family
            </button>
          </span>
        </div>

        <div className="card-body content-body create-form-page">
          <label className="fs-2 fw-normal">
            <span className=" text-danger me-2 fs-2">*</span>
            Required Fields
          </label>
          <form className="row mt-5 gx-5 gy-5" onSubmit={handleSubmitForm}>
            <div className="col-md-6">
              <label htmlFor="familyInputSurname">Family Surname</label>
              <i className="text-danger">*</i>
              <input
                id="familyInputSurname"
                type="text"
                name="surname"
                placeholder="Enter Family Surname"
                className="form-control"
                required={true}
                value={familyForm.surname}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="familyInputVillage">Family Village</label>
              <i className="text-danger">*</i>
              <input
                id="familyInputVillage"
                type="text"
                name="village"
                placeholder="Enter Family Village"
                className="form-control"
                required={true}
                value={familyForm.village}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="familyInputVillageGuj">
                Family Village (ગુજરાતીમાં)
              </label>
              <i className="text-danger">*</i>
              <input
                id="familyInputVillageGuj"
                type="text"
                name="villageGuj"
                placeholder="Enter Family Village in Gujarati"
                className="form-control"
                required={true}
                value={familyForm.villageGuj}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="familyInputCurrentResidency">
                Family Current Residency
              </label>
              {/* <i className='text-danger'>*</i> */}
              <input
                id="familyInputCurrentResidency"
                type="text"
                name="currResidency"
                placeholder="Enter Family's Current Residency"
                className="form-control"
                value={familyForm.currResidency}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="familyInputAdobeOfGod">Family Devsthan</label>
              {/* <i className='text-danger'>*</i> */}
              <input
                id="familyInputAdobeOfGod"
                type="text"
                name="adobeOfGod"
                placeholder="Enter Family Devsthan"
                className="form-control"
                value={familyForm.adobeOfGod}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="familyInputGoddess">Family Kuldevi</label>
              {/* <i className='text-danger'>*</i> */}
              <input
                id="familyInputGoddess"
                type="text"
                name="goddess"
                placeholder="Enter Family Kuldevi"
                className="form-control"
                value={familyForm.goddess}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="familyInputLineage">Family Gautra</label>
              {/* <i className='text-danger'>*</i> */}
              <input
                id="familyInputLineage"
                type="text"
                name="lineage"
                placeholder="Enter Family Gautra"
                className="form-control"
                value={familyForm.lineage}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="familyInputResidencyAddress">
                Family Resedency Address
              </label>
              {/* <i className='text-danger'>*</i> */}
              <textarea
                id="familyInputResidencyAddress"
                type="textarea"
                name="residencyAddress"
                placeholder="Enter Family Residency Address"
                className="form-control fs-3 fw-light"
                value={familyForm.residencyAddress}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="familyInputMainFamilyMEmber">
                Family's Main Family Member (Fullname)
              </label>
              <i className="text-danger">*</i>
              <input
                id="familyInputResidencyAddress"
                type="text"
                name="mainFamilyMemberName"
                placeholder="Enter Main Family Member Fullname"
                className="form-control"
                required={true}
                value={familyForm.mainFamilyMemberName}
                onChange={handleChange}
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
        </div>
      </div>
    </div>
  );
};

export default FamilyForm;
