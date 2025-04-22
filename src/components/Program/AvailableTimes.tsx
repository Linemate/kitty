import useMobile from 'hooks/useMobile';
import React from 'react';

type AvailableTimesProps = {
    selectedTime: string;
    onclick: (time:string) => void;
    isBox?: boolean;
}

const AvailableTimes = (props:AvailableTimesProps) => {
    const {selectedTime, onclick, isBox} = props;
    const isMobile = useMobile();

    const handleChoose = (time:string) => {
        onclick(time);
    }

    return (
        <div className={`choose_time ${isMobile ? 'mobile' : ''} ${isBox ? 'box' : ''}`}>
            <div className='btn_time_wrap'>
                <div className={`available btn_time ${selectedTime === '1300' ? 'selected' : ''}`} onClick={() => handleChoose('1300')}>
                    <div className='time_area'>
                        <strong>1:00 pm</strong>
                    </div>
                    <div className='price_area'>
                        <div className='price'>
                            KRW 50,000
                        </div>
                    </div>
                    <div className='remain_area'>
                        <div className='ico user max_users'>
                            10/12
                        </div>
                        {/* 잔여 인원이 2명일 때 자동으로 HOT */}
                        <div className='ico hot'>
                            HOT
                        </div>
                    </div>
                </div>
                <div className={`available btn_time ${selectedTime === '1600' ? 'selected' : ''}`} onClick={() => handleChoose('1600')}>
                    <div className='time_area'>
                        <strong>4:00 pm</strong>
                    </div>
                    <div className='price_area'>
                        <div className='price'>
                            KRW 50,000
                        </div>
                    </div>
                    <div className='remain_area'>
                        <div className='ico user max_users'>
                            1/12
                        </div>
                    </div>
                </div>
                <div className={`soldout btn_time`} onClick={() => handleChoose('1900')}>
                    <div className='time_area'>
                        <strong>7:00 pm</strong>
                    </div>
                    <div className='price_area'>
                        <div className='price'>
                            KRW 50,000
                        </div>
                    </div>
                    <div className='remain_area'>
                        <div className='ico user max_users'>
                            12/12
                        </div>
                        {/* 잔여 인원이 0명일 때 자동으로 SOLD OUT */}
                        <div className='ico soldout'>
                            Soldout
                        </div>
                    </div>
                </div>
            </div>
            {
                isBox && 
                <div className='notice'>
                    <div className='desc'>
                    The specifics may vary depending on the visit schedule. 
                    </div>
                </div>
            }
        </div>
    );
};

export default AvailableTimes;