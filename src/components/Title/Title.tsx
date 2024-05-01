'use client'
import React from 'react';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import StyledTitle from './StyledTitle';

export type TitleProps = {
    title: string;
    description?: string;
}

const Title = (props:TitleProps) => {
    return (
        <StyledTitle>
            <h3><TagFacesIcon />{props.title}</h3>
            <p>
                {props.description}
            </p>
        </StyledTitle>
    );
};

export default Title;