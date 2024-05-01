'use client'
import styled from "styled-components";
import theme from "theme/theme";

const StyledTitle = styled.div`
    h3 {
        font-size:24px; line-height:40px;
        display:flex;
        flex-direction:row;
        align-items:center;
        svg {margin-right:10px;}
    }
    p {
        padding-left:34px;
        color:${theme.color.darkgray};
    }
    &.main {
        
    }
    &.sub {
        
    }
`;
export default StyledTitle;