import type { Metadata } from 'next';
import './globals.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-datepicker/dist/react-datepicker.css';

export const metadata: Metadata = {
    title: 'LINEMATE',
    description: '라인메이트 입니다.',
    openGraph: {
        title: 'LINEMATE',
        description: '라인메이트 입니다.',
        url: 'https://www.linemate.kr',
        type: 'website',
        images: [
            {
                url: '', // Add a default OG image if available
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
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=yes" />
                <meta name="robots" content="index,follow" />
                <meta name="theme-color" content="#000000" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            </head>
            <body>
                <div className="linemate">{children}</div>
                <div id="modal"></div>
                <div id="popup"></div>
            </body>
        </html>
    );
}
