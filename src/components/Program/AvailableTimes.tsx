import useMobile from 'hooks/useMobile';
import React from 'react';
import { AvailableTimesProps, scheduleProps } from 'types/types';

const AvailableTimes = (props: AvailableTimesProps) => {
    const { selectedTime, times, price, currency, onclick, isBox } = props;
    const isMobile = useMobile();

    const handleChoose = (time: scheduleProps) => {
        onclick(time);
    };

    return (
        <div className={`choose_time ${isMobile ? 'mobile' : ''} ${isBox ? 'box' : ''}`}>
            <div className="btn_time_wrap">
                {times.map((el: scheduleProps) => {
                    const date = new Date(el.reservationDate);
                    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
                    const h = kstDate.getHours();
                    const m = kstDate.getMinutes();
                    const convertedDate = `${h > 12 ? h - 12 : h}:${m < 10 ? '0' + m : m} ${h < 12 ? 'am' : 'pm'}`;
                    return (
                        <div className={`${el.capacity !== el.reservationCount ? 'available' : 'soldout'} btn_time ${selectedTime.id === el.id ? 'selected' : ''}`} onClick={() => handleChoose(el)} key={el.id}>
                            <div className="time_area">
                                <strong>{convertedDate}</strong>
                            </div>
                            <div className="price_area">
                                <div className="price">
                                    {currency} {price.toLocaleString()}
                                </div>
                            </div>
                            <div className="remain_area">
                                <div className="ico user max_users">
                                    {el.reservationCount} / {el.capacity}
                                </div>
                                {
                                    // 잔여 인원이 2명 이하일 때
                                    el.capacity - el.reservationCount <= 2 ? <div className="ico hot">HOT</div> : ''
                                }
                                {
                                    // soldout일 때
                                    el.capacity === el.reservationCount ? <div className="ico soldout">Soldout</div> : ''
                                }
                            </div>
                        </div>
                    );
                })}
            </div>
            {isBox && (
                <div className="notice">
                    <div className="desc">The specifics may vary depending on the visit schedule.</div>
                </div>
            )}
        </div>
    );
};

export default AvailableTimes;
