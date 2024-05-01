'use client'
import styled from 'styled-components';
import theme from 'theme/theme';

const StyledFooter = styled.div`
    min-width:1280px;
    margin:0 auto; 
    padding:50px 0 15px;
    border-top:1px solid #efefef;
    .inner {
        display:flex;
        flex-direction:row;
        .left {
            flex:1;
            font-size:12px;
            line-height:20px;
            .logo {
                width:150px;
                height:50px;
                text-indent:-9999px;
                font-size:0;
                line-height:0;
                background:url('/assets/images/logo.png') no-repeat -10px -34px; background-size:100%;
            }
            .txt {
                padding-left:6px;
                .address {
                    color:#666;
                }
                .number {
                    color:#666;
                    margin-bottom:20px;
                }
                .ceo {
                    color:#666;
                }
            }
        }
        .right {
            flex:2;
            display:flex;
            flex-direction:row;
            .col {
                flex:1;
                .subtitle {
                    color:${theme.color.main};
                    margin-bottom:20px;
                }
                ul li {
                    line-height:22px;
                    a {
                        color:${theme.color.black};
                        font-size:12px;
                        &:hover {
                            color:${theme.color.sub};
                        }
                    }
                }
                &:last-child {
                    ul {
                      display:flex;
                      flex-direction:row;  
                    }
                }
            }
        }
    }
`;

export default StyledFooter;