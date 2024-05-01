'use client'
import styled from 'styled-components';
import theme from 'theme/theme';

const StyledNav = styled.div`
    ul {
        display:flex; flex-direction:row;
        li {
            margin-right:20px;
            a {
                color:${theme.color.main}
            }
        }
    }
`;

export default StyledNav;