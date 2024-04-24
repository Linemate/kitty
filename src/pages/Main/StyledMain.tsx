import styled from "styled-components";
import theme from "theme/theme";

const StyledMain = styled.div`
    .wrapper {
        max-width:1280px;
        width:100%;
        margin:0 auto;
    }

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
            padding-right:10px;
            h3 {
                font-size:24px; line-height:40px;
                display:flex;
                flex-direction:row;
                align-items:center;
                svg {margin-right:10px;}
            }
            p {
                padding-left:34px;
                color:${theme.color.darkgray};
            }
            .btn_all {
                color:#555;
                font-size:16px;
                background:none;
            }
        }
        .slide_area {
            margin-bottom:30px;
            .slide_item {
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
            }
        }
    }

    
    
`
export default StyledMain;