'use client'
import React from 'react';
import styled from 'styled-components';
import theme from 'theme/theme';

const StyledMate = styled.div`
    .img_area {
        display:flex;
        justify-content:center;
        margin-bottom:10px;
        position:relative;
        .profile {
            position:relative;
            .profile_default {
                width:200px; 
                height:200px;
                border-radius:50%;
                background-color:${theme.color.main};
            }
            .mate {
                display:flex;
                justify-content:center;
                position:absolute;
                right:-30px;
                bottom:0px;
                svg {
                    font-size:50px;
                }
            }
        }
    }
    .desc_area {
        .blue_text {
            color:${theme.color.main};
        }
        .name {
            font-size:30px;
            margin-bottom:20px;
        }
        .info {
            font-size:14px;
            color:${theme.color.darkgray};
        }
    }
    .summary {
        display:flex;
        flex-direction:row;
        background-color:#eff3f7;
        padding:15px 40px;
        border-radius:20px;
        .img_area {
            margin-right:30px;
            margin-bottom:0;
            .profile {
                .profile_default {
                    width:100px;
                    height:100px;
                }
            }
        }
        .desc_area {
            .name {
                font-size:20px;
                margin-bottom:5px;
            }
        }
    }
    .detail {
        display:flex;
        flex-direction:column;
        justify-contents:center;
        .desc_area {
            text-align:center;
            display:flex;
            flex-direction:column;
            justify-contents:center;
            margin-bottom:30px;
        }
        .simple_desc {
            display:flex;
            justify-content:center;
            margin-bottom:40px;
            ul {
                width:700px;
                padding:15px 20px;
                background-color: #EDF7FF;
                border-radius:50px;
                display:flex;
                flex-direction:row;
                justify-content:center;
                li {
                    flex:1;
                    display:flex;    
                    justify-content: center;
                    align-items:center;
                    line-height:24px;
                    svg {
                        margin-right:8px;
                    }
                }
            }
        }
        .nums {
            display:flex;
            justify-content:center;
            border-top:1px solid ${theme.color.lightgray};
            border-bottom:1px solid ${theme.color.lightgray};
            margin-bottom:60px;
            ul {
                width:800px;
                padding:30px 0;
                display:flex;
                flex-direction:row;
                justify-content:center;
                li {
                    flex:1;
                    text-align:center;
                    .cate {
                        color:${theme.color.darkgray};
                        font-size:16px;
                        margin-bottom:10px;
                    }
                    .num {
                        font-size:40px;
                        color:${theme.color.main};
                    }
                }

            }
        }
    }
`;

export default StyledMate;