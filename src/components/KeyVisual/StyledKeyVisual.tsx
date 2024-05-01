'use client'
import styled from "styled-components";
import theme from "theme/theme";

const StyledKeyVisual = styled.div`
    .bg {
        width:100%;
        height:400px;
        background-color:${theme.color.lightgray};
        position:relative;
        button {
            position:absolute;
            left:50px;
            top:50%;
            transform:translateY(-50%);
        }
    }
`;
export default StyledKeyVisual;