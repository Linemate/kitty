'use client'
import styled from "styled-components";
import theme from "theme/theme";

const StyledMateDetails = styled.div`
    .slide_wrap {
        margin-bottom:30px;
        .intro {
            margin-bottom:20px;
            display:flex; flex-direction:row;
            justify-content:space-between;
            align-items: flex-end;
            .btn_all {
                color:#555;
                font-size:16px;
                background:none;
            }
        }
        .slide_area {
            margin-bottom:30px;
        }
    }
`
export default StyledMateDetails;