'use client'
import styled from "styled-components";

const StyledProgramDetails = styled.div`
    .mate_area {
        margin-bottom:30px;
    }
    .datepicker_area {
        padding:30px; 
        border-radius:5px;
        margin-bottom:50px;
        background-color:#EDF7FF;
        display:flex;
        flex-direction:row;
        & > div {
            flex:1;
            .react-datepicker {
                width:70%;
            }
        }
        .react-datepicker__month-container {
            float:none;
        }
        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
            width:calc(100% / 7);
            line-height:50px;
            margin:0;
        }
    }

    .title {
        font-size:20px;
        margin-bottom:10px;
    }
    .notice {
        .desc {
            margin-bottom:15px;
        }
    }
    .choose_time {
        .btn_time {
            border-radius:10px;
            padding:15px 30px;
            background-color:#fff;
            margin-bottom:5px;
            display:flex;
            flex-direction:row;
            justify-content:space-between;
            align-items:center;
            line-height:30px;
            color:#E6E6E6;
            &.selected {
                color:#333;
            }
            &.soldout {
                background-color:#ddd;
                color:#E6E6E6;
            }
            .time_area {
                display:flex;
                flex-direction:row;
                align-items:center;
                strong {
                    margin-left:5px;
                }
            }
            .price_area {
                display:flex;
                flex-direction:row;
                position:relative;
                .text {
                    width:max-content;
                    position:absolute;
                    right:0;
                    top:0;
                    line-height:30px;
                    color:#7B7B7B;
                    font-size:20px;
                }
            }
        }
        .btn_reservation {
            width:100%;
            padding:15px 0;
            font-size:20px;
            background-color:#229DFF;
            color:#fff;
            border-radius:5px;
            margin-top:15px;
        }
    }

    .tab {
        ul {
            display:flex;
            flex-direction:row;
            li {
                padding:5px 15px;
                font-size:20px;
                border-radius:30px;
                line-height:40px;
                color:#C9C9C9;
                &.selected {
                    background-color:#229DFF;
                    color:#fff;
                }
            }
        }
    }
`
export default StyledProgramDetails;