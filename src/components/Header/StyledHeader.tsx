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

        h1 {
            margin-right:20px;
        }
    }
    .header_right {
        display:flex;
        flex-direction:row;
    }
`;

export default StyledHeader;