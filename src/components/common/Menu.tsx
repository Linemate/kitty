import React from 'react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import 'styles/menu.scss';
import Link from 'next/link';
import { useAuthStore } from 'utils/stores';
import { getCookie } from 'utils/cookiesFunction';

const Menu = ({ closeMenu, lang, changeLang, openLanguage, setOpenLanguage }: { closeMenu: () => void; lang: string; changeLang: (lang: string) => void; openLanguage: boolean; setOpenLanguage: (open: boolean) => void }) => {
    const router = useRouter();
    const isLogin = useAuthStore.getState().userInfo?.token;
    const handleLogin = () => {
        router.push('/login');
    };
    return (
        <div className="menu_wrap">
            <div className="menu_header">
                <div className="menu_header_left">
                    <Button text="Close" classnames="close img" type="button" onclick={closeMenu} />
                </div>
                {isLogin || getCookie('USERINFO') ? <span className="logined">Hi Buddy!</span> : <Button type={'img'} classnames={'login'} text={'로그인'} onclick={handleLogin} />}
            </div>
            <div className="menu_body">
                <Link href="/experience">Experience</Link>
            </div>
            <div className="menu_footer">
                <Button type={'img text left'} classnames={`language`} text={lang === 'kr' ? 'KR' : 'EN'} onclick={() => setOpenLanguage(!openLanguage)} />

                {openLanguage ? (
                    <>
                        <div className="options">
                            <div onClick={() => changeLang('EN')}>EN</div>
                            <div onClick={() => changeLang('KR')}>KR</div>
                        </div>
                    </>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default Menu;
