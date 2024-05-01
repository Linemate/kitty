'use client'
import React from 'react';
import StyledNav from './StyledNav';
import { navData } from 'assets/data/data';
import { Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';

const Nav = () => {
    const router = useRouter();
    const viewPage = (link:string) => {
        router.push(`/${link}`);
    }
    return (
        <StyledNav>
            <ul>
                {
                    navData.map((el, i) => el.navName === 'Linecare' ? <li key={i}><Tooltip title="Soon" arrow>
                    <div onClick={() => viewPage(el.link)}>{el.navName}</div>
                  </Tooltip></li> : <li key={i}><div onClick={() => viewPage(el.link)}>{el.navName}</div></li>)
                }
            </ul>
        </StyledNav>
    );
};

export default Nav;