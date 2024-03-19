import Header from 'components/Header/Header';
import React from 'react';
import KeyVisual from 'components/KeyVisual/KeyVisual';
import StyledMain from './StyledMain';
import { categoryData } from 'assets/data/data';

const Main = () => {
    return (
        <StyledMain>
            <div className='wrapper'>
                {/* Header & Key visual */}
                <Header title={'라인메이트 메인'} />
                <KeyVisual />

                {/* Contents */}
                <div className='cate'>
                    {
                        categoryData.map((el, i) => <div className='cate_item' key={i}>
                            {el.enName}
                        </div>)

                    }
                </div>
            </div>
        </StyledMain>
    );
};

export default Main;