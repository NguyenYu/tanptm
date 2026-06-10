import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SideBar from './sidebar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata = {
    title: 'Report',
    description: 'Hôm nay có report nè',
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="bg-primary h-full overflow-hidden">
                <div className="bg-primary h-16 w-full"></div>
                <div className="flex h-screen flex-row">
                    <div className="bg-primary text-primary-text w-60">
                        <SideBar />
                    </div>
                    <div className="text-primary-text w-full flex-1 bg-black">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
