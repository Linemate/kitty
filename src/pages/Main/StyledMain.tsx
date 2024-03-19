import styled from "styled-components";

const StyledMain = styled.div`
    .wrapper {
        max-width:1280px;
        width:100%;
        margin:0 auto;
    }

    .cate {
        display:flex;
        flex-direction:row;
        align-items:center;
        .cate_item {
            flex:1;
            text-align:center;
            &:first-child {
                text-align:left;
            }
            &:last-child {
                text-align:right;
            }
        }
    }
    
`
export default StyledMain;