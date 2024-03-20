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
            h3 {
                font-size:20px; line-height:35px;
                display:flex;
                flex-direction:row;
                align-items:center;
                svg {margin-right:6px;}
            }
            p {
                color:${theme.color.darkgray};
            }
        }
        .slide_area {
            display:flex;
            flex-direction:row;
            align-items:center;
            .slide_item {
                margin-right:15px;
                .img_area {
                    width:300px; 
                    height:150px;
                    background-color:${theme.color.main};
                    margin-bottom:10px;
                }
                .desc_area {
                    display:flex;
                    flex-direction:row;
                    margin-bottom:10px;
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
                    .badge_where_area {
                        display:flex;
                        flex-direction:row;
                        justify-content:space-between;
                        margin-bottom:10px;
                        .badge {
                            display:inline-block;
                            padding:5px 8px;
                            background-color:${theme.color.main};
                            color:#fff;
                            border-radius:15px;
                            margin-right:5px;
                            font-size:14px;
                        }
                        .where {
                            font-size:15px;
                            color:${theme.color.darkgray};
                        }
                    }
                    .price_area {
                        font-size:15px;
                        .unit {
                            margin-right:5px;
                        }
                    }
                }
            }
        }
    }

    .
    
`
export default StyledMain;