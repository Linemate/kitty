'use client'
import React from 'react';
import styled from 'styled-components';

const StyledSlideWrap = styled.div`
    .slick-next::before {
        content:'>';
        color:red;
    }
    .slick-prev::before {
        content:'<';
        color:red;
    }
`;

export default StyledSlideWrap;