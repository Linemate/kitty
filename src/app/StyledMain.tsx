'use client'
import styled from "styled-components";
import theme from "theme/theme";

const StyledMain = styled.div`
    .cate {
        display:flex;
        flex-direction:row;
        align-items:center;
        margin: 30px 0;
        .cate_item {
            flex:1;
            text-align:center;
            margin: 30px 0;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            border-radius:30px;
            .img_area {
                width:150px; 
                height:50px; background-color:${theme.color.main};
            }
            .txt_area {
                margin-top:10px;
            }
        }
    }
    .slide_wrap {
        margin-bottom:30px;
        .intro {
            margin-bottom:20px;
            display:flex; flex-direction:row;
            justify-content:space-between;
            align-items: flex-end;
            .btn_all {
                color:#555;
                font-size:16px;
                background:none;
            }
        }
        .slide_area {
            margin-bottom:30px;
        }
    }

    
    
`
export default StyledMain;