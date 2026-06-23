'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { QRCodeSVG } from 'qrcode.react';

function App() {
    const [qrList, setQrList] = useState([]);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setLoading(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const validData = jsonData
                    .map((row) => {
                        const maBill = row['Mã bill']?.toString().trim();
                        const maVach = row['Mã vạch']
                            ?.toString()
                            .replace(/\*/g, '')
                            .trim();
                        return { maBill, maVach };
                    })
                    .filter((item) => item.maBill && item.maBill !== '');

                setQrList(validData);
            } catch (error) {
                console.error('Lỗi khi đọc file Excel:', error);
                alert(
                    'Có lỗi xảy ra khi xử lý file. Vui lòng kiểm tra lại định dạng file!',
                );
            } finally {
                setLoading(false);
            }
        };

        setTimeout(() => {
            reader.readAsArrayBuffer(file);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-pink-50/60 px-4 py-8 font-sans sm:px-6 lg:px-8 print:min-h-0 print:bg-white print:p-0">
            {/* STYLE ÉP PHÂN TRANG A7 VÀ TRIỆT TIÊU HEADER/SIDEBAR NGOÀI LUỒNG */}
            <style>{`
                @media print {
                    @page {
                        size: A7 portrait;
                        margin: 0;
                    }
                    /* Ẩn Header/Footer mặc định chứa ngày tháng, URL của trình duyệt Chrome/Edge */
                    html, body {
                        margin: 0;
                        padding: 0;
                        background: #white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    /* Đảm bảo nếu Sidebar nằm ở layout tổng bên ngoài app thì vẫn bị triệt tiêu */
                    header, footer, sidebar, nav, .sidebar, #sidebar {
                        display: none !important;
                    }
                }
            `}</style>

            <div className="mx-auto max-w-4xl print:max-w-full">
                {/* 1. KHU VỰC TẢI FILE (HEADER CỦA TRANG WEB) - ẨN KHI IN */}
                <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm print:hidden">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-pink-700">
                        <span>📦</span>Nhúng Dữ Liệu
                    </h2>
                    <div className="mt-4 flex w-full items-center justify-center">
                        <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-pink-200 bg-pink-50/20 transition-colors hover:bg-pink-50/50">
                            <div className="flex flex-col items-center justify-center pt-3 pb-4">
                                <p className="text-sm font-medium text-gray-600">
                                    {fileName ? (
                                        <span className="font-bold text-pink-600">
                                            Đang chạy file: {fileName}
                                        </span>
                                    ) : (
                                        <>
                                            Kéo thả hoặc{' '}
                                            <span className="text-pink-600 underline">
                                                chọn file Excel .xlsx
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={loading}
                            />
                        </label>
                    </div>
                </div>

                {/* TRẠNG THÁI LOADING */}
                {loading ? (
                    <div className="my-12 flex flex-col items-center justify-center gap-3 py-8 print:hidden">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
                        <p className="animate-pulse text-sm font-semibold text-pink-600">
                            Hệ thống đang xử lý và tạo mã QR, vui lòng đợi...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* TRẠNG THÁI TRỐNG */}
                        {qrList.length === 0 ? (
                            <div className="mt-6 rounded-2xl border border-pink-100 bg-white py-12 text-center shadow-sm print:hidden">
                                <p className="text-sm font-medium text-pink-400">
                                    Vui lòng chọn file dữ liệu để hiển thị danh
                                    sách hàng.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6">
                                {/* DANH SÁCH MÃ QR */}
                                <div className="flex flex-col gap-4 print:block print:gap-0">
                                    {qrList.map((item, index) => (
                                        <div
                                            key={index}
                                            className="print:page-break-after-always flex break-inside-avoid flex-row items-center justify-between rounded-xl border border-pink-200 bg-white p-4 text-left shadow-sm transition-all hover:border-pink-300 print:flex print:h-[105mm] print:w-[74mm] print:flex-col print:items-center print:justify-center print:rounded-none print:border-0 print:p-0 print:text-center print:shadow-none"
                                        >
                                            {/* Phần Mã Bill - Khi in sẽ nằm hàng dọc trên cùng */}
                                            <div className="flex flex-col gap-1 print:mb-4 print:w-full print:flex-col print:items-center print:gap-1">
                                                <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase print:text-gray-500">
                                                    Mã Bill
                                                </span>
                                                <span className="rounded-md border border-pink-50 bg-pink-50/50 px-2 py-1 font-mono text-sm font-bold text-pink-700 print:border-0 print:bg-transparent print:text-base">
                                                    {item.maBill}
                                                </span>
                                            </div>

                                            {/* Khối mã QR nền hồng ở giữa */}
                                            <div className="flex min-w-[150px] flex-col items-center gap-2 rounded-xl border border-pink-100 bg-pink-50 p-3 print:rounded-2xl print:border-0 print:bg-pink-50 print:p-4">
                                                <QRCodeSVG
                                                    value={
                                                        item.maVach ||
                                                        item.maBill
                                                    }
                                                    size={120}
                                                    level={'M'}
                                                    bgColor={'#fdf2f8'}
                                                    fgColor={'#831843'}
                                                />

                                                {/* Chuỗi số mã vạch dưới chân */}
                                                <span className="mt-1 font-mono text-[11px] font-medium tracking-widest text-pink-900 print:text-xs">
                                                    {item.maVach}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
