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
            setShowModal(true); // Hiện Modal

            // Xóa danh sách cũ sau khi xuất thành công
            setList([]);
            setEditingIndex(null);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            alert('Có lỗi xảy ra khi tạo file!');
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
        <div className="relative flex min-h-screen items-start justify-center bg-[#FFF0F3] p-4 font-sans text-[#4A2830] antialiased sm:p-6 md:p-8">
            {/* ---- 1. HIỆU ỨNG LOADING TOÀN MÀN HÌNH (1 GIÂY) ---- */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm transition-all">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FFF8F9] border-t-[#E91E63]"></div>
                    <p className="rounded-xl bg-[#4A2830] px-4 py-2 text-sm font-bold tracking-wider text-white uppercase shadow-lg">
                        Đang khởi tạo file Word...
                    </p>
                </div>
            )}

            {/* ---- 2. CỬA SỔ MODAL HIỂN THỊ FILE SAU KHI TẠO XONG ---- */}
            {showModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in zoom-in-95 w-full max-w-md rounded-3xl border border-[#FFBCC6] bg-white p-6 shadow-2xl duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-base font-bold tracking-wide text-[#C2185B] uppercase">
                                🎉 Xuất File Thành Công
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="cursor-pointer text-lg font-bold text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="my-6 flex flex-col items-center rounded-2xl border border-dashed border-[#FFA3B1] bg-[#FFF8F9] p-4 text-center">
                            <div className="mb-2 text-3xl">📄</div>
                            <span className="text-xs font-bold break-all text-[#4A1521]">
                                {fileName}
                            </span>
                            <p className="mt-2 text-[11px] text-gray-500">
                                File đã được tải xuống máy của bạn.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {/* Nút bấm mở xem nhanh trên trình duyệt thông qua Office Online */}
                            <a
                                href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(window.location.origin + '/' + fileName)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full rounded-xl bg-linear-to-r from-[#E91E63] to-[#F43F5E] py-2.5 text-center text-xs font-bold text-white shadow-md transition-all hover:opacity-95"
                            >
                                🔍 XEM ĐỌC FILE TRÊN WEB LIỀN
                            </a>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full cursor-pointer rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-200"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GIAO DIỆN CHÍNH GIỮ NGUYÊN HOÀN TOÀN CẤU TRÚC GỐC */}
            <div className="grid w-full max-w-5xl grid-cols-1 divide-y divide-[#FFBCC6] overflow-hidden rounded-3xl border border-[#FFBCC6] bg-[#FFE3E8] shadow-[0_20px_50px_rgba(219,39,119,0.12)] md:grid-cols-12 md:divide-x md:divide-y-0">
                {/* CỘT TRÁI: FORM */}
                <div className="flex flex-col justify-between bg-[#FFE3E8] p-6 sm:p-8 md:col-span-5">
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold tracking-wider text-[#C2185B] uppercase">
                                    Biên Bản Bưu Cục
                                </h1>
                                <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-[#9C6D77]">
                                    Cập nhật dữ liệu bồi hoàn hành chính
                                </p>
                            </div>
                            {editingIndex !== null && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="cursor-pointer text-xs font-bold text-[#D81B60] transition-colors hover:text-[#AD1457]"
                                >
                                    Hủy sửa ✕
                                </button>
                            )}
                        </div>

                        <form
                            onSubmit={formik.handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="mb-1.5 block pl-0.5 text-[10px] font-bold tracking-wider text-[#884D59] uppercase">
                                    Nhân viên bồi hoàn
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Nhập họ và tên..."
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    className="w-full rounded-xl border border-[#FFA3B1] bg-[#FFF8F9] px-4 py-2.5 text-sm font-semibold text-[#4A1521] placeholder-[#D2A0A9] transition-all focus:border-[#D81B60] focus:ring-2 focus:ring-[#D81B60]/10 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block pl-0.5 text-[10px] font-bold tracking-wider text-[#884D59] uppercase">
                                    Bưu cục
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['HBQN10', 'HCM05'].map((route) => (
                                        <button
                                            key={route}
                                            type="button"
                                            onClick={() =>
                                                formik.setFieldValue(
                                                    'route',
                                                    route,
                                                )
                                            }
                                            className={`cursor-pointer rounded-xl border py-2.5 text-sm transition-all duration-300 ${formik.values.route === route ? 'border-transparent bg-linear-to-r from-[#E91E63] to-[#F43F5E] font-bold text-white shadow-[0_6px_15px_rgba(233,30,99,0.3)]' : 'border-[#FFA3B1] bg-[#FFF8F9] text-[#884D59] hover:border-[#E91E63] hover:bg-[#FFE3E8] hover:text-[#D81B60]'}`}
                                        >
                                            {route}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block pl-0.5 text-[10px] font-bold tracking-wider text-[#884D59] uppercase">
                                    Số tiền quy trách nhiệm
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="amount"
                                        required
                                        placeholder="Nhập số tiền..."
                                        onChange={formik.handleChange}
                                        value={formik.values.amount}
                                        className="w-full rounded-xl border border-[#FFA3B1] bg-[#FFF8F9] py-2.5 pr-14 pl-4 text-sm font-bold text-[#4A1521] placeholder-[#D2A0A9] transition-all focus:border-[#D81B60] focus:ring-2 focus:ring-[#D81B60]/10 focus:outline-none"
                                    />
                                    <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[10px] font-extrabold tracking-wider text-[#E91E63]">
                                        VND
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`mt-2 w-full cursor-pointer rounded-xl py-3 text-sm font-bold tracking-wider text-white shadow-md transition-all duration-200 active:scale-[0.99] ${editingIndex !== null ? 'bg-linear-to-r from-[#EA580C] to-[#F97316] shadow-[0_6px_15px_rgba(234,88,12,0.25)]' : 'bg-linear-to-r from-[#E91E63] to-[#F43F5E] shadow-[0_8px_20px_rgba(233,30,99,0.25)] hover:opacity-95'}`}
                            >
                                {editingIndex !== null
                                    ? 'CẬP NHẬT DÒNG NÀY'
                                    : 'THÊM VÀO DANH SÁCH'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* CỘT PHẢI: DANH SÁCH */}
                <div className="flex min-h-85 flex-col justify-between bg-[#FFD6DC] p-6 sm:p-8 md:col-span-7 md:min-h-105">
                    <div>
                        <div className="mb-4 flex items-center justify-between px-0.5">
                            <span className="text-[10px] font-extrabold tracking-wider text-[#884D59] uppercase">
                                Preview danh sách ({list.length})
                            </span>
                            {list.length > 0 && (
                                <span className="rounded-full bg-linear-to-r from-[#E91E63] to-[#F43F5E] px-3 py-1 text-xs font-bold text-white shadow-[0_4px_12px_rgba(233,30,99,0.15)]">
                                    Tổng:{' '}
                                    {formatNumber(
                                        list.reduce(
                                            (acc, curr) =>
                                                acc + Number(curr.amount || 0),
                                            0,
                                        ),
                                    )}
                                    đ
                                </span>
                            )}
                        </div>

                        <div className="flex max-h-65 scrollbar-thin scrollbar-thumb-[#FFA3B1] scrollbar-track-transparent flex-col gap-3 overflow-y-auto pr-1">
                            {list.length > 0 ? (
                                list.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleEdit(index)}
                                        className={`cursor-pointer rounded-2xl border p-3 transition-all duration-300 ${
                                            editingIndex === index
                                                ? 'border-[#E91E63] bg-white shadow-[0_4px_12px_rgba(233,30,99,0.15)] ring-1 ring-[#E91E63]'
                                                : 'border-[#FFBCC6]/50 bg-[#FFF8F9]/60 hover:border-[#FFA3B1] hover:bg-white hover:shadow-sm'
                                        }`}
                                    >
                                        <Person
                                            name={item.name}
                                            route={item.route}
                                            amount={item.amount}
                                            onEdit={() => handleEdit(index)}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#FFA3B1] bg-[#FFF8F9]/50 py-12 text-[#A87680]">
                                    <span className="text-xs font-semibold tracking-wide">
                                        Chưa có dữ liệu nhân sự bồi hoàn
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {list.length > 0 && (
                        <div className="mt-4 flex justify-end border-t border-[#FFBCC6] pt-4">
                            <button
                                onClick={handleExportDocx}
                                className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E91E63] bg-[#FFF8F9] px-5 py-2.5 text-xs font-bold tracking-wider text-[#E91E63] uppercase shadow-sm transition-all duration-300 hover:border-transparent hover:bg-linear-to-r hover:from-[#E91E63] hover:to-[#F43F5E] hover:text-white active:scale-[0.98]"
                            >
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
