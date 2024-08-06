'use client'
import React from 'react';
import 'styles/service.scss'
const Service = () => {
    return (
        <div className='service'>
            <div className='inner'>
                <div className='item'>
                    <div className='ico trophy'></div>
                    <div className='txt_area'>
                        <div className='title'>
                            High Quality
                        </div> 
                        <p>
                            Real Trip For Travelers
                        </p>
                    </div>
                </div>
                <div className='item'>
                    <div className='ico protection'></div>
                    <div className='txt_area'>
                        <div className='title'>
                            Warranty Protection
                        </div> 
                        <p>
                            Every Mates are Reliable
                        </p>
                    </div>
                </div>
                <div className='item'>
                    <div className='ico memories'></div>
                    <div className='txt_area'>
                        <div className='title'>
                            Give Memories
                        </div> 
                        <p>
                            We Can Be Friends
                        </p>
                    </div>
                </div>
                <div className='item'>
                    <div className='ico support'></div>
                    <div className='txt_area'>
                        <div className='title'>
                            Fast Support
                        </div> 
                        <p>
                            Dedicated Support
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Service;