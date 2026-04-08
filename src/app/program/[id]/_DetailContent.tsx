'use client';
import React, { memo } from 'react';
import 'styles/detailContent.scss';

const DetailContent = memo(function DetailContent({ html }: { html: string }) {
    return <div className="safe_detail_content" dangerouslySetInnerHTML={{ __html: html }} />;
});

export default DetailContent;