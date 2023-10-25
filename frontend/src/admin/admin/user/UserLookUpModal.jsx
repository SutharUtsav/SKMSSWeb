import React, { useRef } from 'react'
import '../Common.css'


const UserLookUpModal = (props) => {

    const closeModal = useRef(null);

    return (
        <div className="modal fade"
            data-bs-backdrop="static"
            id="userLookUpModal"
            tabIndex="-1"
            aria-labelledby="userLookUpModalLabel"
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header p-5 fs-1 fw-normal">
                        <h5>Select User</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            ref={closeModal}
                            onClick={() => {
                                props.setmodalForFather(false)
                                props.setmodalForMother(false)
                            }}
                        ></button>
                    </div>
                    <div className="modal-body fs-2 fw-light">
                        {props.userLookUp.length ? (
                            <>
                                <div className='border-bottom px-5 py-4 lookup-modal' data-bs-dismiss="modal" onClick={() => {
                                    if (props.modalForFather) {
                                        props.setselectedFather(null)
                                    }
                                    else if (props.modalForMother) {
                                        props.setselectedMother(null)
                                    }
                                }}>
                                    {`No ${props.modalForFather ? 'Father' : props.modalForMother ? "Mother" : "User"} Selected`
                                    }
                                </div>
                                {props.userLookUp.map((user, index) => (
                                    <div key={index}>
                                        {(props.modalForFather && user.gender === "MALE") || (props.modalForMother && user.gender === "FEMALE") ? (

                                            <div className={`border-bottom px-5 py-4 lookup-modal ${props.selectedFather.name === user.name || props.selectedMother.name === user.name ? 'active' : ''}`} data-bs-dismiss="modal"  onClick={() => {

                                                if (props.modalForFather) {
                                                    props.setselectedFather(user)
                                                }
                                                else if (props.modalForMother) {
                                                    props.setselectedMother(user)
                                                }

                                                closeModal.current.click()
                                            }}>
                                                <div className='d-flex align-items-center justify-content-between'>
                                                    <p className='d-block'><b>Name :</b><span>{user.name}</span></p>
                                                    <p><b>Surname : </b>{user.surname}</p>
                                                    <p><b>Village : </b>{user.village}</p>
                                                </div>


                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div>
                                loading ...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserLookUpModal
