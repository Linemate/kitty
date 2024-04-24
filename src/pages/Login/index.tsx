import React from 'react';
import StyledLogin from './StyledLogin';
import Header from 'components/Header/Header';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <StyledLogin>
            <div className='wrapper'>
                <Header title={'라인메이트 로그인'} />
                <div className='contents'>
                    <div className='text_area'>
                        <h2>Welcome!</h2>
                        <p>New to Linemate? <Link to={'/register'}>Register</Link></p>
                    </div>
                    <div className='btn_area'>
                        <button type="button">BUDDY</button>
                        <button type="button">MATE</button>
                    </div>
                </div>
            </div>
        </StyledLogin>
    );
};

export default Login;