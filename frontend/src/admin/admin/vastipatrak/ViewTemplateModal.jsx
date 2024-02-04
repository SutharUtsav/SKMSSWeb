import React from 'react'

const ViewTemplateModal = (props) => {
    return (

        <div className="modal fade" id="TemplateViewModal" tabindex="-1" aria-labelledby="TemplateViewModalLabel" aria-hidden="true">
            <div className="modal-dialog" style={{
                maxWidth: "fit-content",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}>
                <div className="modal-content" style={{overflow:"auto", width:"fit-content", height:"fit-content"}}>
                    {props.content ?
                        <div className="modal-body" dangerouslySetInnerHTML={{ __html: props.content }}>
                        </div>
                        : null}
                </div>
            </div>
        </div>

    )
}

export default ViewTemplateModal
