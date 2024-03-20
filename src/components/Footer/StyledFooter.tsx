import styled from 'styled-components';

const StyledFooter = styled.div`
    min-width:1280px;
    margin:0 auto; 
    padding:20px 0 15px;
    .inner {
        display:flex;
        flex-direction:row;
        .left {
            flex:1;
            .logo {
                margin-bottom:20px;
            }
            .number {
                margin-bottom:20px;
            }
        }
        .right {
            flex:2;
            display:flex;
            flex-direction:row;
            .col {
                flex:1;
                .subtitle {
                    margin-bottom:20px;
                }
                ul li {
                    line-height:40px;
                }
            }
        }
    }
`;

export default StyledFooter;