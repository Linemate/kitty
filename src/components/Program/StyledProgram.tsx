'use client'
import styled from 'styled-components';
import theme from 'theme/theme';

const StyledProgram = styled.div`
    .img_area {
        // 640 x 388 
        width:300px; 
        height:150px;
        background-color:${theme.color.main};
        margin-bottom:10px;
    }
    .desc_area {
        width:300px;
        display:flex;
        flex-direction:row;
        .txt_area {
            padding-top:10px;
            padding-right:20px;
            h4 {
                margin-bottom:5px;
            }
            p {
                color:${theme.color.darkgray};
                font-size:14px;
                line-height:20px;
            }
        }
    }
    .bottom_area {
        width:300px;
        border-top:1px solid #dedede;
        margin-top:10px;
        padding-top:10px;
        .badge_where_area {
            display:flex;
            flex-direction:row;
            justify-content:space-between;
            margin-bottom:10px;
        }
        .badge {
            margin-top:5px;
            display:inline-block;
            padding:5px 8px;
            background-color:${theme.color.main};
            color:#fff;
            border-radius:15px;
            margin-right:5px;
            font-size:13px;
        }
        .where {
            margin-top:5px;
            font-size:15px;
            color:${theme.color.darkgray};
        }
        .price_area {
            font-size:15px;
            padding-top:10px;
            color:#555;
            .unit {
                margin-right:5px;
            }
        }
    }

    &.details {
        margin-bottom:50px;
        .img_area {
            width:100%;
            height:400px;
        }
        .desc_area {
            width:100%;
            justify-content: space-between;
        }
        .bottom_area {
            width:100%;
        }
        .price_area {
            padding-top:38px;
        }
        .where_share_area {
            display:flex;
            flex-direction:row;
            justify-content:space-between;
        }
    }
`;

export default StyledProgram;