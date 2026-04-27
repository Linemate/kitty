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
            {times && times.length > 0 && (
                <div className="btn_time_wrap">
                    {times.map((el: scheduleProps) => {
                    const formatTime = (isoString?: string) => {
                        if (!isoString) return '';
                        // ISO 8601 문자열을 Date 객체로 변환 시 로컬 타임셋 오프셋 방지를 위해 KST(+9) 더하기 (기존 로직 동일 적용)
                        const d = new Date(isoString);
                        const kstD = new Date(d.getTime() + 9 * 60 * 60 * 1000);
                        const h = kstD.getUTCHours();
                        const m = kstD.getUTCMinutes();
                        return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
                    };
                    const convertedDate = `${formatTime(el.startDate)}~${formatTime(el.endDate)}`;
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
            )}
            {isBox && (
                <div className="notice">
                    <div className="desc">The specifics may vary depending on the visit schedule.</div>
                </div>
            )}
        </div>
    );
};

export default AvailableTimes;
