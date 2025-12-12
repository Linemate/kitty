import ModalPortal from 'components/Portal/ModalPortal';
import React from 'react';

const AddReview = ({closePortal} : {closePortal:Function}) => {
    return (
        <>
            <ModalPortal type='review' closePortal={closePortal}>
                <div>

                </div>
            </ModalPortal>
        </>
    );
};

export default AddReview;