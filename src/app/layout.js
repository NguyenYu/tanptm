import { Inter } from 'next/font/google';
import './globals.css';
import Header from './header';
import SideBar from './sidebar';

// Cấu hình font Inter chuẩn hóa toàn bộ dấu Tiếng Việt
const interFont = Inter({
    subsets: ['vietnamese'], // BẮT BUỘC phải có subsets này để không bị lỗi font khi gõ tiếng Việt
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-inter', // Đặt tên biến CSS
});

export const metadata = {
    title: 'Report',
    description: 'Hôm nay có report nè',
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${interFont.variable} font-sans  text-[#4A2830] bg-[#FFF0F3] h-full antialiased`}
        >
            <body className="bg-primary h-full overflow-hidden">
                <Header />
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
