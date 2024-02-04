import React from 'react'
import '../Common.css'
import UserImage from "../../../images/profile.jpg";

const FamilyLookUpModal = (props) => {


    return (
        <div className="modal fade"
            id="familyLookUpModal"
            tabIndex="-1"
            aria-labelledby="familyLookUpModalLabel"
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header p-5 fs-1 fw-normal">
                        Select Family
                    </div>
                    <div className="modal-body fs-2 fw-light">
                        {props.familyLookUp.length ? (
                            <>
                                <div className='border-bottom px-5 py-4 lookup-modal' data-bs-dismiss="modal" onClick={() => {
                                    props.setselectedFamily(null)
                                }}>
                                    No Family Selected
                                </div>
                                {props.familyLookUp.map((family, index) => (
                                    <div className={props.selectedFamily && family.surname === props.selectedFamily.surname && family.village === props.selectedFamily.village && family.villageGuj === props.selectedFamily.villageGuj && family.mainFamilyMemberName === props.selectedFamily.mainFamilyMemberName ? 'border-bottom px-5 py-4 lookup-modal d-flex active' : 'border-bottom px-5 py-4 d-flex lookup-modal'} data-bs-dismiss="modal" key={index} onClick={() => {
                                        props.setselectedFamily(family)
                                    }}>
                                        <img src={family.mainFamilyMemberImage ? family.mainFamilyMemberImage : UserImage} alt='Main Family Member Image' style={{ width:"50px", aspectRatio:"1", objectFit:"cover", border:"1px solid", padding:"2px", borderRadius:"50%", marginRight:"5px"}} />
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <p><b>Surname </b>{family.surname}</p>
                                            <p><b>Village  </b>{family.village}</p>
                                        </div>
                                        <p><b>Main Family Member Name  </b>{family.mainFamilyMemberName}</p>

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

export default FamilyLookUpModal
