import Link from 'next/link';
import { ClipboardCheck, LayoutDashboard, Settings, UserCircle, FolderKanban, FileText, BarChart3, HelpCircle } from 'lucide-react';

const SideBar = () => {
    const menuItems = [
        { id: 1, label: 'Bảng điều khiển', href: '/', icon: LayoutDashboard },
        { id: 2, label: 'Biên bản', href: '/', icon: ClipboardCheck },
        { id: 3, label: 'Báo cáo', href: '/', icon: BarChart3 },
        { id: 4, label: 'Dự án', href: '/', icon: FolderKanban },
        { id: 5, label: 'Tài liệu', href: '/', icon: FileText },
        { id: 6, label: 'Hồ sơ cá nhân', href: '/', icon: UserCircle },
        { id: 7, label: 'Cài đặt hệ thống', href: '/', icon: Settings },
        { id: 8, label: 'Trợ giúp', href: '/', icon: HelpCircle },
    ];

    return (
        /* NỀN SIDEBAR: Đổi sang màu hồng sáng mềm mại, đồng điệu với trang chính */
        <div className="h-full w-full bg-[#FFE3E8] p-5 flex flex-col gap-3 border-r border-[#FFBCC6]">

            {/* Header Sidebar: Logo thương hiệu */}
            <div className="flex items-center gap-3 px-4 mb-6">
                <div className="bg-gradient-to-br from-[#E91E63] to-[#F43F5E] size-10 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(233,30,99,0.2)]">
                    <span className="text-white font-extrabold text-xl">S</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[#4A1521] text-base font-bold ">Quản Lý</span>
                    <span className="text-[#9C6D77] text-xs font-semibold">Báo Cáo & Biên Bản</span>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="text-[#884D59] text-[11px] font-bold px-4 mb-1 uppercase tracking-wider">
                Menu Chính
            </div>

            {/* Danh sách menu */}
            {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <div key={item.id} className="w-full flex items-center h-[46px]">
                        <Link
                            href={item.href}
                            /* Hover đổi nền sang màu hồng đậm loang nhẹ, chữ đổi sắc hồng đậm nét */
                            className="group text-[#5C303A] hover:text-[#E91E63] hover:bg-[#FFF0F3] flex h-full w-full items-center gap-3 px-4 transition-all duration-300 rounded-r-3xl border-l-4 border-transparent hover:border-[#E91E63] font-bold text-sm"
                        >
                            <Icon className="size-5 text-[#9C6D77] group-hover:text-[#E91E63] transition-colors duration-300" />
                            <span className="flex-1 tracking-wide">{item.label}</span>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default SideBar;