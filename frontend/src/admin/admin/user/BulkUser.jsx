import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { bulkInsert, post } from "../../../service/api-service";

const BulkUser = (props) => {
  const [bulkUploadForm, setbulkUploadForm] = useState({
    excelSheet: null,
  });

  return (
    <div className="bulk-upload-menu">
      <h4>Bulk Upload</h4>
      <p>User Bulk Upload Form</p>
      <form className="row"  onSubmit={(e)=>{
            e.preventDefault();
            bulkInsert("/user/bulkInsert", bulkUploadForm).then(response => {
              console.log(response);
              if (response && response.data.status === 1) {
                console.log(response.data.data.message)
                props.setisReloadData();
              } else {
                console.log("Data not inserted successfully")
              }
            })
            .catch((error)=> {
              console.log("Error", error)
            })
          }}>
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="upload_file">Excel File</label>
            <input
              type="file"
              name="upload_file"
              id="upload_file"
              required="required"
              accept=".xls, .xlsx"
              className="form-control"
              onChange={(e) => {
                setbulkUploadForm({
                  ...bulkUploadForm,
                  excelSheet: e.target.files[0],
                });
              }}
            />
          </div>
        </div>
        <div className="col-md-12">
          <button type="submit" className="btn" name="btnAdd" id="submit_btn">
            <FaUpload fill="#fff" /> Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkUser;
