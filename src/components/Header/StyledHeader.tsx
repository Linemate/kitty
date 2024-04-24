'use client';
import styled from 'styled-components';

const StyledHeader = styled.div`
    max-width:1280px;
    width:100%;
    margin:0 auto; 
    padding:20px 0 15px;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    .header_left {
        display:flex;
        flex-direction:row;
        align-items:center;
        h1 {
            width:200px;
            height:50px;
            text-indent:-9999px;
            margin-right:10px;
            background:url('/assets/images/logo.png') no-repeat -10px center; background-size:100%;
        }
    }
    .header_right {
        display:flex;
        flex-direction:row;
    }
`;

export default StyledHeader;