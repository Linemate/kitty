'use client'
import React from 'react';
import StyledHeader from './StyledHeader';
import Nav from 'components/Nav/Nav';
import { Button, IconButton } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';

export type HeaderProps = {
    title: string;
    isDepth? : boolean;
}

const Header = (props:HeaderProps) => {
    return (
        <StyledHeader>
            <div className='header_left'>
                <h1>LINEMATE</h1>
                <Nav />
            </div>
            <div className='header_right'>
                <IconButton aria-label="global">
                    <PublicIcon />
                </IconButton>
                <IconButton aria-label="my">
                    <PersonIcon />
                </IconButton>
                <Button>
                    Login
                </Button>
            </div>
        </StyledHeader>
    );
};

export default Header;