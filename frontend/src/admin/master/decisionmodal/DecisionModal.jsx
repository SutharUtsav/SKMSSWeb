import React, { useRef } from 'react'
import { EnumConsts } from '../../../consts/EnumConsts'
import QuestionImg from '../../../images/question.webp'

const DecisionModal = (props) => {

    const closeModalRef = useRef(null);

    return (
        <div className="modal fade" data-bs-backdrop="static" id={EnumConsts.DECISIONMODALID} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeModalRef} onClick={()=>{
                            props.setdeleteRecordId(null)
                        }}></button>
                    </div>
                    <div className="modal-body d-flex flex-column align-items-center">
                        <img src={QuestionImg} alt='question' width={150} height={150}></img>
                        <h3 className='fs-1'>{props.topic ? props.topic : "No Topic Selected"}</h3>
                        <p className='fs-3 fw-light' style={{ textTransform: "none" }} >{props.message ? props.message  : "No mesaage selected!"}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-save" onClick={() => {
                            if(props.deleteRecordId){
                                props.onYes()
                            }
                            else{
                                console.log("Role id is not selected")
                            }
                            closeModalRef.current.click()
                        }}>Yes</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>{
                            props.setdeleteRecordId(null)
                        }}>No</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DecisionModal
