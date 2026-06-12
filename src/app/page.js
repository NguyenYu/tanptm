'use client';
import { useFormik } from 'formik';
import { useState } from 'react';
import Person from './person';
import { exportFullAdministrativeDocx } from './HeaderDocx';

const Report = () => {
    const [date, setDate] = useState(new Date());
    const [list, setList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    // ---- STATE PHỤC VỤ CHỨC NĂNG MỚI ----
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState('');

    const formatNumber = (num) => {
        if (num === undefined || num === null || isNaN(num)) return '0';
        return Number(num).toLocaleString('en-US');
    };

    // ---- XỬ LÝ LỆNH IN WORD + LOADING 1 GIÂY ----
    const handleExportDocx = async () => {
        setIsLoading(true); // Bật hiệu ứng Loading

        // Chờ đúng 1 giây (1000ms) để giả lập xử lý hệ thống
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const formatDate = (date) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        };
        const meetingInfo = { date: formatDate(date) };

        try {
            // Thực thi hàm tạo file từ HeaderDocx của bạn
            // Lưu ý: Hàm exportFullAdministrativeDocx gốc của bạn cần trả về/hoặc tạo file. 
            // Đoạn này ta tạo blob để truyền link trực tiếp vào Modal cho user click đọc.
            exportFullAdministrativeDocx(list, meetingInfo);

            // Giả lập tên file phục vụ hiển thị trên Modal
            const generatedFileName = `Bien_Ban_Boi_Hoan_${formatDate(date).replaceAll('/', '-')}.docx`;

            // Cập nhật trạng thái để hiển thị Modal dữ liệu
            setFileName(generatedFileName);
            setIsLoading(false); // Tắt loading
            setShowModal(true);  // Hiện Modal

            // Xóa danh sách cũ sau khi xuất thành công
            setList([]);
            setEditingIndex(null);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            alert("Có lỗi xảy ra khi tạo file!");
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            route: 'HBQN10',
            amount: '',
        },
        onSubmit: (values, { resetForm }) => {
            if (editingIndex !== null) {
                const updatedList = [...list];
                updatedList[editingIndex] = values;
                setList(updatedList);
                setEditingIndex(null);
            } else {
                setList([...list, values]);
            }
            resetForm({ values: { name: '', route: 'HBQN10', amount: '' } });
        },
    });

    const handleEdit = (index) => {
        const itemToEdit = list[index];
        formik.setValues(itemToEdit);
        setEditingIndex(index);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        formik.resetForm({ values: { name: '', route: 'HBQN10', amount: '' } });
    };

    return (
        <div className="min-h-screen bg-[#FFF0F3] text-[#4A2830] flex items-start justify-center p-4 sm:p-6 md:p-8 font-sans antialiased relative">

            {/* ---- 1. HIỆU ỨNG LOADING TOÀN MÀN HÌNH (1 GIÂY) ---- */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 transition-all">
                    <div className="w-12 h-12 border-4 border-t-[#E91E63] border-[#FFF8F9] rounded-full animate-spin"></div>
                    <p className="text-white font-bold text-sm tracking-wider uppercase bg-[#4A2830] px-4 py-2 rounded-xl shadow-lg">
                        Đang khởi tạo file Word...
                    </p>
                </div>
            )}

            {/* ---- 2. CỬA SỔ MODAL HIỂN THỊ FILE SAU KHI TẠO XONG ---- */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#FFBCC6] animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="font-bold text-base text-[#C2185B] uppercase tracking-wide">🎉 Xuất File Thành Công</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer">✕</button>
                        </div>

                        <div className="my-6 bg-[#FFF8F9] border border-dashed border-[#FFA3B1] p-4 rounded-2xl flex flex-col items-center text-center">
                            <div className="text-3xl mb-2">📄</div>
                            <span className="text-xs font-bold text-[#4A1521] break-all">{fileName}</span>
                            <p className="text-[11px] text-gray-500 mt-2">File đã được tải xuống máy của bạn.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* Nút bấm mở xem nhanh trên trình duyệt thông qua Office Online */}
                            <a
                                href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(window.location.origin + '/' + fileName)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full text-center py-2.5 bg-gradient-to-r from-[#E91E63] to-[#F43F5E] text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all"
                            >
                                🔍 XEM ĐỌC FILE TRÊN WEB LIỀN
                            </a>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GIAO DIỆN CHÍNH GIỮ NGUYÊN HOÀN TOÀN CẤU TRÚC GỐC */}
            <div className="w-full max-w-5xl bg-[#FFE3E8] rounded-3xl border border-[#FFBCC6] shadow-[0_20px_50px_rgba(219,39,119,0.12)] overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#FFBCC6]">

                {/* CỘT TRÁI: FORM */}
                <div className="p-6 sm:p-8 md:col-span-5 flex flex-col justify-between bg-[#FFE3E8]">
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold tracking-wider text-[#C2185B] uppercase">Biên Bản Bưu Cục</h1>
                                <p className="text-[11px] text-[#9C6D77] mt-0.5 font-semibold tracking-wide">Cập nhật dữ liệu bồi hoàn hành chính</p>
                            </div>
                            {editingIndex !== null && (
                                <button type="button" onClick={handleCancelEdit} className="text-xs font-bold text-[#D81B60] hover:text-[#AD1457] transition-colors cursor-pointer">
                                    Hủy sửa ✕
                                </button>
                            )}
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-[#884D59] uppercase tracking-wider mb-1.5 pl-0.5">Nhân viên bồi hoàn</label>
                                <input type="text" name="name" required placeholder="Nhập họ và tên..." onChange={formik.handleChange} value={formik.values.name} className="w-full px-4 py-2.5 bg-[#FFF8F9] border border-[#FFA3B1] rounded-xl text-sm text-[#4A1521] font-semibold transition-all focus:outline-none focus:border-[#D81B60] focus:ring-2 focus:ring-[#D81B60]/10 placeholder-[#D2A0A9]" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-[#884D59] uppercase tracking-wider mb-1.5 pl-0.5">Bưu cục</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['HBQN10', 'HCM05'].map((route) => (
                                        <button key={route} type="button" onClick={() => formik.setFieldValue('route', route)} className={`py-2.5 text-sm rounded-xl transition-all duration-300 cursor-pointer border ${formik.values.route === route ? 'bg-gradient-to-r from-[#E91E63] to-[#F43F5E] text-white border-transparent shadow-[0_6px_15px_rgba(233,30,99,0.3)] font-bold' : 'bg-[#FFF8F9] text-[#884D59] border-[#FFA3B1] hover:text-[#D81B60] hover:bg-[#FFE3E8] hover:border-[#E91E63]'}`}>
                                            {route}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-[#884D59] uppercase tracking-wider mb-1.5 pl-0.5">Số tiền quy trách nhiệm</label>
                                <div className="relative">
                                    <input type="number" name="amount" required placeholder="Nhập số tiền..." onChange={formik.handleChange} value={formik.values.amount} className="w-full pl-4 pr-14 py-2.5 bg-[#FFF8F9] border border-[#FFA3B1] rounded-xl text-sm font-bold text-[#4A1521] transition-all focus:outline-none focus:border-[#D81B60] focus:ring-2 focus:ring-[#D81B60]/10 placeholder-[#D2A0A9]" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-[#E91E63] tracking-wider">VND</span>
                                </div>
                            </div>

                            <button type="submit" className={`w-full mt-2 py-3 rounded-xl text-sm font-bold tracking-wider text-white transition-all duration-200 active:scale-[0.99] cursor-pointer shadow-md ${editingIndex !== null ? 'bg-gradient-to-r from-[#EA580C] to-[#F97316] shadow-[0_6px_15px_rgba(234,88,12,0.25)]' : 'bg-gradient-to-r from-[#E91E63] to-[#F43F5E] shadow-[0_8px_20px_rgba(233,30,99,0.25)] hover:opacity-95'}`}>
                                {editingIndex !== null ? 'CẬP NHẬT DÒNG NÀY' : 'THÊM VÀO DANH SÁCH'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* CỘT PHẢI: DANH SÁCH */}
                <div className="p-6 sm:p-8 md:col-span-7 bg-[#FFD6DC] flex flex-col justify-between min-h-[340px] md:min-h-[420px]">
                    <div>
                        <div className="flex justify-between items-center mb-4 px-0.5">
                            <span className="text-[10px] font-extrabold text-[#884D59] uppercase tracking-wider">Preview danh sách ({list.length})</span>
                            {list.length > 0 && (
                                <span className="text-xs font-bold text-white bg-gradient-to-r from-[#E91E63] to-[#F43F5E] px-3 py-1 rounded-full shadow-[0_4px_12px_rgba(233,30,99,0.15)]">
                                    Tổng: {formatNumber(list.reduce((acc, curr) => acc + Number(curr.amount || 0), 0))}đ
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 overflow-y-auto max-h-[260px] pr-1 scrollbar-thin scrollbar-thumb-[#FFA3B1] scrollbar-track-transparent">
                            {list.length > 0 ? (
                                list.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleEdit(index)}
                                        className={`transition-all duration-300 rounded-2xl cursor-pointer p-3 border ${editingIndex === index
                                            ? 'bg-white border-[#E91E63] shadow-[0_4px_12px_rgba(233,30,99,0.15)] ring-1 ring-[#E91E63]'
                                            : 'bg-[#FFF8F9]/60 border-[#FFBCC6]/50 hover:bg-white hover:border-[#FFA3B1] hover:shadow-sm'
                                            }`}
                                    >
                                        <Person name={item.name} route={item.route} amount={item.amount} onEdit={() => handleEdit(index)} />
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-[#A87680] border border-dashed border-[#FFA3B1] rounded-xl bg-[#FFF8F9]/50">
                                    <span className="text-xs font-semibold tracking-wide">Chưa có dữ liệu nhân sự bồi hoàn</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {list.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#FFBCC6] flex justify-end">
                            <button onClick={handleExportDocx} className="px-5 py-2.5 bg-[#FFF8F9] border border-[#E91E63] text-[#E91E63] hover:bg-gradient-to-r hover:from-[#E91E63] hover:to-[#F43F5E] hover:text-white hover:border-transparent text-xs font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-sm cursor-pointer flex items-center gap-2 active:scale-[0.98]">
                                Tiến Hành In Word
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Report;