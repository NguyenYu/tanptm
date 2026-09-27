import { Inter } from 'next/font/google';
import './globals.css';
import Header from './header';
import SideBar from './sidebar';

const interFont = Inter({ subsets: ['vietnamese'], weight: ['400', '500', '600', '700', '800'], variable: '--font-inter' });

export const metadata = { title: 'Quản lý biên bản', description: 'Quản lý và xuất biên bản bồi hoàn hành chính' };

export default function RootLayout({ children }) {
    return <html lang="vi" className={`${interFont.variable} h-full font-sans antialiased`}><body className="min-h-full bg-slate-50"><Header /><SideBar /><div className="pt-[76px] lg:pl-64">{children}</div></body></html>;
}
