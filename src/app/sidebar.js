import Link from 'next/link';
import {
    ClipboardCheck,
    LayoutDashboard,
    Settings,
    UserCircle,
    FolderKanban,
    FileText,
    BarChart3,
    HelpCircle,
} from 'lucide-react';

const SideBar = () => {
    const menuItems = [
        { id: 1, label: 'Bảng điều khiển', href: '/', icon: LayoutDashboard },
        { id: 2, label: 'Biên bản', href: '/', icon: ClipboardCheck },
        {
            id: 3,
            label: 'Tạo QRcode',
            href: '/generate-qrcode',
            icon: BarChart3,
        },
        { id: 4, label: 'Dự án', href: '/', icon: FolderKanban },
        { id: 5, label: 'Tài liệu', href: '/', icon: FileText },
        { id: 6, label: 'Hồ sơ cá nhân', href: '/', icon: UserCircle },
        { id: 7, label: 'Cài đặt hệ thống', href: '/', icon: Settings },
        { id: 8, label: 'Trợ giúp', href: '/', icon: HelpCircle },
    ];

    return (
        /* NỀN SIDEBAR: Đổi sang màu hồng sáng mềm mại, đồng điệu với trang chính */
        <div className="fixed flex h-full w-60 flex-col gap-3 border-r bg-[#FFE3E8] p-5">
            {/* Header Sidebar: Logo thương hiệu */}
            <div className="mb-6 flex items-center gap-3 px-4">
                <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-[#E91E63] to-[#F43F5E] shadow-[0_4px_12px_rgba(233,30,99,0.2)]">
                    <span className="text-xl font-extrabold text-white">S</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-base font-bold text-[#4A1521]">
                        Quản Lý
                    </span>
                    <span className="text-xs font-semibold text-[#9C6D77]">
                        Báo Cáo & Biên Bản
                    </span>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="mb-1 px-4 text-[11px] font-bold tracking-wider text-[#884D59] uppercase">
                Menu Chính
            </div>

            {/* Danh sách menu */}
            {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.id}
                        className="flex h-11.5 w-full items-center"
                    >
                        <Link
                            href={item.href}
                            /* Hover đổi nền sang màu hồng đậm loang nhẹ, chữ đổi sắc hồng đậm nét */
                            className="group flex h-full w-full items-center gap-3 rounded-r-3xl border-l-4 border-transparent px-4 text-sm font-bold text-[#5C303A] transition-all duration-300 hover:border-[#E91E63] hover:bg-[#FFF0F3] hover:text-[#E91E63]"
                        >
                            <Icon className="size-5 text-[#9C6D77] transition-colors duration-300 group-hover:text-[#E91E63]" />
                            <span className="flex-1 tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default SideBar;
