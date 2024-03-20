import styled from "styled-components";
import theme from "theme/theme";

const StyledService = styled.div`
    padding:50px 10px;
    display:flex;
    flex-direction:row;
    align-items:center;
    .item {
        flex:1;   
        display:flex;
        flex-direction:row;
        align-items:center;
        svg {
            width:40px; height:40px;
            margin-right:10px;
        }
        .title {
            font-size:18px;
            margin-bottom:5px;
        }
        p {
            color:${theme.color.darkgray};
        }
    }
`;

export default StyledService;