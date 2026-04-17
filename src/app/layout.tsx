import type { Metadata } from 'next';
import './globals.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-datepicker/dist/react-datepicker.css';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
    const favicon = isMobile ? '/favicon.ico' : '/favicon-pc.ico';

    return {
        title: 'LINEMATE',
        description: '라인메이트 입니다.',
        openGraph: {
            title: 'LINEMATE',
            description: '라인메이트 입니다.',
            url: 'https://www.linemate.kr',
            type: 'website',
            images: [
                {
                    url: '',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary',
            title: 'LINEMATE',
            description: '',
            images: [],
        },
        viewport: {
            width: 'device-width',
            initialScale: 1,
            maximumScale: 1,
            minimumScale: 1,
            userScalable: true,
        },
        themeColor: '#000000',
        icons: {
            icon: favicon,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <div className="linemate">{children}</div>
                <div id="modal"></div>
                <div id="popup"></div>
            </body>
        </html>
    );
}
