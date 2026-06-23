'use client';
import { Search, Bell, User, Sun, MessageSquare } from 'lucide-react';

const Header = () => {
    return (
        /* HEADER CONTAINER: Màu hồng sáng mượt, có bo góc nhẹ và đổ bóng tinh tế */
        <header className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-[#FFBCC6] bg-[#FFE3E8]/90 px-6 shadow-[0_4px_20px_rgba(219,39,119,0.05)] backdrop-blur-md sm:px-10">
            {/* PHẦN TRÁI: Chào hỏi hoặc Breadcrumb */}
            <div className="flex flex-col">
                <h2 className="text-lg font-bold text-[#4A1521]">
                    Chào buổi sáng! 👋
                </h2>
                <p className="text-xs font-semibold text-[#9C6D77]">
                    Hôm nay bưu cục thế nào rồi?
                </p>
            </div>

            {/* PHẦN GIỮA: Thanh tìm kiếm thiết kế tối giản */}
            <div className="mx-8 hidden max-w-md flex-1 items-center md:flex">
                <div className="group relative w-full">
                    <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#A87680] transition-colors group-focus-within:text-[#E91E63]" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm biên bản, nhân viên..."
                        className="w-full rounded-2xl border border-[#FFA3B1] bg-[#FFF8F9] py-2.5 pr-4 pl-11 text-sm font-medium text-[#4A1521] placeholder-[#D2A0A9] transition-all focus:border-[#E91E63] focus:ring-4 focus:ring-[#E91E63]/5 focus:outline-none"
                    />
                </div>
            </div>

            {/* PHẦN PHẢI: Các nút hành động & Profile */}
            <div className="flex items-center gap-3 sm:gap-5">
                {/* Nút Chat/Hỗ trợ */}
                <button className="hidden size-10 cursor-pointer items-center justify-center rounded-xl border border-[#FFA3B1] bg-[#FFF8F9] text-[#884D59] shadow-sm transition-all hover:bg-white hover:text-[#E91E63] active:scale-95 sm:flex">
                    <MessageSquare className="size-5" />
                </button>

                {/* Nút Thông báo (Có chấm đỏ highlight) */}
                <button className="relative flex size-10 cursor-pointer items-center justify-center rounded-xl border border-[#FFA3B1] bg-[#FFF8F9] text-[#884D59] shadow-sm transition-all hover:bg-white hover:text-[#E91E63] active:scale-95">
                    <Bell className="size-5" />
                    <span className="absolute top-2.5 right-2.5 size-2 rounded-full border-2 border-[#FFF8F9] bg-[#F43F5E]"></span>
                </button>

                {/* Đường kẻ phân cách dọc */}
                <div className="mx-1 h-8 w-[1px] bg-[#FFBCC6]"></div>

                {/* Profile người dùng */}
                <div className="group flex cursor-pointer items-center gap-3 pl-2">
                    <div className="flex hidden flex-col items-end sm:flex">
                        <span className="text-sm leading-none font-bold text-[#4A1521]">
                            Admin
                        </span>
                        <span className="mt-1 text-[10px] font-extrabold tracking-widest text-[#E91E63] uppercase">
                            Quản lý
                        </span>
                    </div>

                    {/* Avatar có viền Gradient Hồng */}
                    <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#E91E63] to-[#FB7185] p-0.5 shadow-[0_4px_12px_rgba(233,30,99,0.2)] transition-transform group-hover:scale-105">
                        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#FFF8F9]">
                            <User className="size-6 text-[#E91E63]" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
