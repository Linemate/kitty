'use client'
import React from 'react';
import styled from 'styled-components';

const StyledFavorite = styled.div`
    .favorite_area {
        display:flex;
        align-items:center;
        .amount {
            color:#666;
            font-size:13px;
            text-align:center;
        }
    }
    &.mate {
        .favorite_area {
            flex-direction:row;
            .amount {
                line-height:40px;
            }
        }
    }
    &.program {
        .favorite_area {
            flex-direction:column;
        }
    }
`;

export default StyledFavorite;