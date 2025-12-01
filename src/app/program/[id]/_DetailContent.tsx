'use client';
import React from 'react';
import 'styles/detailContent.scss';

const DetailContent = ({html} : {html: string}) => {
    return (
        <div className='safe_detail_content' dangerouslySetInnerHTML={{ __html: html }} /> 
    );
};

export default DetailContent;