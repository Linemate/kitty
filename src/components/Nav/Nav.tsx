import React from 'react';
import StyledNav from './StyledNav';
import { navData } from 'assets/data/data';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const Nav = () => {
    return (
        <StyledNav>
            <ul>
                {
                    navData.map((el, i) => el.navName === 'Linecare' ? <li key={i}><Tooltip title="Soon" arrow>
                    <Link to={el.link}>{el.navName}</Link>
                  </Tooltip></li> : <li key={i}><Link to={el.link}>{el.navName}</Link></li>)
                }
            </ul>
        </StyledNav>
    );
};

export default Nav;