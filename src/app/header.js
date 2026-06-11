'use client';
import { Search, Bell, User, Sun, MessageSquare } from 'lucide-react';

const Header = () => {
    return (
        /* HEADER CONTAINER: Màu hồng sáng mượt, có bo góc nhẹ và đổ bóng tinh tế */
        <header className="w-full h-20 bg-[#FFE3E8]/90 backdrop-blur-md border-b border-[#FFBCC6] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50 shadow-[0_4px_20px_rgba(219,39,119,0.05)]">

            {/* PHẦN TRÁI: Chào hỏi hoặc Breadcrumb */}
            <div className="flex flex-col">
                <h2 className="text-[#4A1521] text-lg font-bold">Chào buổi sáng! 👋</h2>
                <p className="text-[#9C6D77] text-xs font-semibold">Hôm nay bưu cục thế nào rồi?</p>
            </div>

            {/* PHẦN GIỮA: Thanh tìm kiếm thiết kế tối giản */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#A87680] group-focus-within:text-[#E91E63] transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm biên bản, nhân viên..."
                        className="w-full pl-11 pr-4 py-2.5 bg-[#FFF8F9] border border-[#FFA3B1] rounded-2xl text-sm text-[#4A1521] font-medium transition-all focus:outline-none focus:border-[#E91E63] focus:ring-4 focus:ring-[#E91E63]/5 placeholder-[#D2A0A9]"
                    />
                </div>
            </div>

            {/* PHẦN PHẢI: Các nút hành động & Profile */}
            <div className="flex items-center gap-3 sm:gap-5">

                {/* Nút Chat/Hỗ trợ */}
                <button className="hidden sm:flex size-10 items-center justify-center bg-[#FFF8F9] border border-[#FFA3B1] rounded-xl text-[#884D59] hover:text-[#E91E63] hover:bg-white transition-all shadow-sm cursor-pointer active:scale-95">
                    <MessageSquare className="size-5" />
                </button>

                {/* Nút Thông báo (Có chấm đỏ highlight) */}
                <button className="relative size-10 items-center justify-center bg-[#FFF8F9] border border-[#FFA3B1] rounded-xl text-[#884D59] hover:text-[#E91E63] hover:bg-white transition-all shadow-sm cursor-pointer active:scale-95 flex">
                    <Bell className="size-5" />
                    <span className="absolute top-2.5 right-2.5 size-2 bg-[#F43F5E] rounded-full border-2 border-[#FFF8F9]"></span>
                </button>

                {/* Đường kẻ phân cách dọc */}
                <div className="w-[1px] h-8 bg-[#FFBCC6] mx-1"></div>

                {/* Profile người dùng */}
                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-[#4A1521] text-sm font-bold leading-none">Admin</span>
                        <span className="text-[#E91E63] text-[10px] font-extrabold uppercase tracking-widest mt-1">Quản lý</span>
                    </div>

                    {/* Avatar có viền Gradient Hồng */}
                    <div className="size-11 rounded-2xl p-0.5 bg-gradient-to-tr from-[#E91E63] to-[#FB7185] shadow-[0_4px_12px_rgba(233,30,99,0.2)] group-hover:scale-105 transition-transform">
                        <div className="w-full h-full bg-[#FFF8F9] rounded-[14px] flex items-center justify-center overflow-hidden">
                            <User className="size-6 text-[#E91E63]" />
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;