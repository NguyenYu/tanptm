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

    // Hàm mở tab mới và ép kích thước thực tế A7
    const handlePrintAll = () => {
        if (qrList.length === 0) return;

        const printWindow = window.open('', '_blank');
        const printContent =
            document.getElementById('print-area-source').innerHTML;

        printWindow.document.write(`
            <html>
                <head>
                    <title>In mã QR</title>
                    <style>
                        @media print {
                            @page {
                                size: 74mm 105mm; /* Ép kích thước A7 bằng số milimet cụ thể */
                                margin: 0;
                            }
                            html, body {
                                margin: 0;
                                padding: 0;
                                width: 74mm;
                                height: 105mm;
                                background: #ffffff;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                        }
                        
                        body {
                            font-family: system-ui, -apple-system, sans-serif;
                        }

                        /* Định dạng khối nhãn in */
                        .print-item {
                            page-break-after: always;
                            break-after: page;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            
                            /* Cố định chuẩn khung giấy A7 dọc */
                            width: 74mm;
                            height: 105mm;
                            box-sizing: border-box;
                            padding: 5mm;
                            margin: 0 auto;
                        }

                        .bill-title {
                            font-size: 11px;
                            font-weight: 600;
                            text-transform: uppercase;
                            color: #6b7280;
                            letter-spacing: 0.05em;
                            margin-bottom: 2px;
                        }
                        .bill-value {
                            font-size: 18px;
                            font-weight: bold;
                            color: #831843;
                            font-family: monospace;
                            margin-bottom: 15px;
                        }
                        .qr-box {
                            background-color: #fdf2f8 !important;
                            padding: 16px;
                            border-radius: 16px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                        }
                        .barcode-footer {
                            margin-top: 8px;
                            font-family: monospace;
                            font-size: 13px;
                            font-weight: 500;
                            letter-spacing: 0.1em;
                            color: #831843;
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        window.onload = function() {
                            // Chờ một chút để đồ họa ổn định rồi gọi in
                            setTimeout(function() {
                                window.print();
                                window.close();
                            }, 300);
                        };
                    <\/script>
                </body>
            </html>
        `);

        printWindow.document.close();
    };

    return (
        <div className="min-h-screen bg-pink-50/60 px-4 py-8 font-sans sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* 1. KHU VỰC TẢI FILE */}
                <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
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

                    {/* NÚT BẤM IN */}
                    {qrList.length > 0 && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handlePrintAll}
                                className="flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-pink-700 active:scale-95"
                            >
                                <span>🖨️</span> Bấm để in tất cả mã QR
                            </button>
                        </div>
                    )}
                </div>

                {/* TRẠNG THÁI LOADING */}
                {loading ? (
                    <div className="my-12 flex flex-col items-center justify-center gap-3 py-8">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
                        <p className="animate-pulse text-sm font-semibold text-pink-600">
                            Hệ thống đang xử lý và tạo mã QR, vui lòng đợi...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* TRẠNG THÁI TRỐNG */}
                        {qrList.length === 0 ? (
                            <div className="mt-6 rounded-2xl border border-pink-100 bg-white py-12 text-center shadow-sm">
                                <p className="text-sm font-medium text-pink-400">
                                    Vui lòng chọn file dữ liệu để hiển thị danh
                                    sách hàng.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <h3 className="mb-3 text-sm font-semibold text-gray-500">
                                    Bản xem trước danh sách ({qrList.length}{' '}
                                    mã):
                                </h3>

                                <div
                                    id="print-area-source"
                                    className="flex flex-col gap-4"
                                >
                                    {qrList.map((item, index) => (
                                        <div
                                            key={index}
                                            className="print-item flex flex-col items-center justify-center rounded-xl border border-pink-200 bg-white p-4 text-center shadow-sm"
                                        >
                                            {/* Phần Mã Bill */}
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <span className="bill-title text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                                                    Mã Bill
                                                </span>
                                                <span className="bill-value rounded-md border border-pink-50 bg-pink-50/50 px-2 py-1 font-mono text-sm font-bold text-pink-700">
                                                    {item.maBill}
                                                </span>
                                            </div>

                                            {/* Khối mã QR */}
                                            <div className="qr-box flex min-w-[150px] flex-col items-center gap-2 rounded-xl border border-pink-100 bg-pink-50 p-3">
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

                                                {/* Chuỗi số mã vạch */}
                                                <span className="barcode-footer mt-1 font-mono text-[11px] font-medium tracking-widest text-pink-900">
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
