import styled from 'styled-components';
import theme from 'theme/theme';

const StyledNav = styled.div`
    ul {
        display:flex; flex-direction:row;
        li {
            margin-right:10px;
            a {
                color:${theme.color.main}
            }
        }
    }
`;

export default StyledNav;