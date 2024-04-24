import styled from "styled-components";
import theme from "theme/theme";

const StyledService = styled.div`
    padding:80px 10px;
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
            margin-right:15px;
            color:${theme.color.main};
        }
        .title {
            font-size:18px;
            margin-bottom:10px;
        }
        p {
            font-size:14px;
            color:${theme.color.darkgray};
        }
    }
`;

export default StyledService;