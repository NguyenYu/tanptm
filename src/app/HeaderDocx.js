import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    VerticalAlign,
    BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

/**
 * Hàm xuất file Biên Bản Quy Trách Nhiệm Đền Bù y chang file gốc bưu cục 100%
 * @param {Array} inputData - Mảng danh sách nhân viên nhập vào từ giao diện
 * @param {Object} meetingInfo - Các thông tin metadata của cuộc họp
 */
export const exportFullAdministrativeDocx = async (
    inputData = [],
    meetingInfo = {},
) => {
    // Khoảng cách đệm bên trong các ô của bảng tính theo dxa (1 pt = 26 dxa)
    const cellMargins = { top: 5, bottom: 5, left: 100, right: 100 };
    const cellMarginBottom = { top: 160, bottom: 160, left: 100, right: 100 };

    // --- TỰ ĐỘNG TÍNH TOÁN SỐ TIỀN TỔNG CỘNG THEO DỮ LIỆU THỰC TẾ ---
    const totalAmount = inputData.reduce((sum, item) => {
        const numericValue = parseInt(
            item.amount?.toString().replace(/,/g, '') || '0',
            10,
        );
        return sum + numericValue;
    }, 0);
    const formattedTotal = new Intl.NumberFormat('en-US').format(totalAmount);

    // --- I. TIÊU NGỮ QUỐC HIỆU (BẢNG ẨN VIỀN ĐỐI XỨNG PHẲNG) ---
    const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.DASH_SMALL_GAP, color: 'ffffff' },
            bottom: { style: BorderStyle.DASH_SMALL_GAP, color: 'ffffff' },
            left: { style: BorderStyle.DASH_SMALL_GAP, color: 'ffffff' },
            right: { style: BorderStyle.DASH_SMALL_GAP, color: 'ffffff' },
            insideHorizontal: {
                style: BorderStyle.DASH_SMALL_GAP,
                color: 'ffffff',
            },
            insideVertical: {
                style: BorderStyle.DASH_SMALL_GAP,
                color: 'ffffff',
            },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 45, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text:
                                            meetingInfo.branchName ||
                                            'CHI NHÁNH BƯU CHÍNH VIETTEL HỒ CHÍ MINH',
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text:
                                            meetingInfo.postOfficeName ||
                                            'BƯU CỤC HBQN10 + HCM05',
                                        bold: true,
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 55, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                                        bold: true,
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'Độc lập – Tự do – Hạnh phúc',
                                        bold: true,
                                        underline: {
                                            style: 'single',
                                            color: '000000',
                                        },
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    // --- II. ĐOẠN VĂN MÔ TẢ CHI TIẾT TỪNG ĐỒNG CHÍ (DÀN TRANG TỰ ĐỘNG) ---
    const detailedParagraphs = inputData.map((item) => {
        return new Paragraph({
            spacing: { before: 400, after: 8 },
            bullet: { level: 0 },
            alignment: AlignmentType.JUSTIFY,
            children: [
                new TextRun({
                    text: 'Đ/C ',
                    font: 'Times New Roman',
                    size: 26,
                }),
                new TextRun({
                    text: item.name,
                    font: 'Times New Roman',
                    size: 26,
                }),
                new TextRun({
                    text: `  Bưu cục giao ${item.route || 'HBQN10'}, trong quá trình làm việc không tuân thủ đúng quy trình phát hàng đúng giờ dẫn đến đền bù với tổng số tiền cước đền bù là `,
                    font: 'Times New Roman',
                    size: 26,
                }),
                new TextRun({
                    text: `${item.amount}đ`,
                    font: 'Times New Roman',
                    size: 26,
                }),
                new TextRun({ text: '.', font: 'Times New Roman', size: 26 }),
            ],
        });
    });

    // --- III. BẢNG DỮ LIỆU TỔNG HỢP (VIỀN ĐEN MẢNH TRUYỀN THỐNG Y CHANG FILE GỐC) ---
    const mainDataTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: 'single', size: 4, color: '000000' },
            bottom: { style: 'single', size: 4, color: '000000' },
            left: { style: 'single', size: 4, color: '000000' },
            right: { style: 'single', size: 4, color: '000000' },
            insideHorizontal: { style: 'single', size: 4, color: '000000' },
            insideVertical: { style: 'single', size: 4, color: '000000' },
        },
        rows: [
            // 1. Dòng Header Tiêu Đề Bảng
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 8, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        shading: {
                            fill: 'FFD8BE',
                        },
                        margins: cellMargins,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'STT',
                                        bold: true,
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 38, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        alignment: AlignmentType.CENTER,
                        margins: cellMargins,
                        shading: {
                            fill: 'FFD8BE',
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'Đối tượng quy TNC',
                                        alignment: AlignmentType.CENTER,
                                        bold: true,
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 5, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        alignment: AlignmentType.CENTER,
                        margins: cellMargins,
                        shading: {
                            fill: 'FFD8BE',
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'Chức danh',
                                        alignment: AlignmentType.CENTER,
                                        bold: true,
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        alignment: AlignmentType.CENTER,
                        margins: cellMargins,
                        shading: {
                            fill: 'FFD8BE',
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'Số tiền',
                                        alignment: AlignmentType.CENTER,
                                        bold: true,
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        alignment: AlignmentType.CENTER,
                        margins: cellMargins,
                        shading: {
                            fill: 'FFD8BE',
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'Lý do',
                                        alignment: AlignmentType.CENTER,
                                        bold: true,
                                        size: 26,
                                        font: 'Times New Roman',
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            // 2. Map Động Toàn Bộ Dòng Dữ Liệu Nhân Viên Khớp Kích Thước Chữ
            ...inputData.map(
                (item, index) =>
                    new TableRow({
                        children: [
                            new TableCell({
                                verticalAlign: VerticalAlign.CENTER,
                                margins: cellMargins,
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: (index + 1).toString(),
                                                font: 'Times New Roman',
                                                size: 26,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                margins: cellMargins,
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: item.name || '',
                                                font: 'Times New Roman',
                                                size: 26,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                margins: cellMargins,
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: item.role || 'NVBT',
                                                font: 'Times New Roman',
                                                size: 26,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                margins: cellMargins,
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: item.amount.toString(),
                                                font: 'Times New Roman',
                                                size: 26,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                            new TableCell({
                                margins: cellMargins,
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text:
                                                    item.reason ||
                                                    'không tuân thủ đúng quy trình khai thác',
                                                font: 'Times New Roman',
                                                size: 26,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
            ),
            // 3. Dòng Tổng Cộng Gộp Ô Cuối Bảng
            new TableRow({
                width: { size: 20, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                    new TableCell({
                        columnSpan: 3,
                        margins: cellMarginBottom,
                        shading: {
                            fill: 'FFD8BE',
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'TỔNG',
                                        bold: true,
                                        font: 'Times New Roman',
                                        size: 26,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        margins: cellMargins,
                        shading: {
                            fill: 'FFD8BE',
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: formattedTotal,
                                        bold: true,
                                        font: 'Times New Roman',
                                        size: 26,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        margins: cellMargins,
                        shading: {
                            fill: 'FFD8BE',
                        },
                        children: [new Paragraph('')],
                    }),
                ],
            }),
        ],
    });

    // --- IV. BẢNG KÝ TÊN ĐỐI XỨNG CUỐI VĂN BẢN ---
    const signatureTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: 'nil' },
            bottom: { style: 'nil' },
            left: { style: 'nil' },
            right: { style: 'nil' },
            insideHorizontal: { style: 'nil' },
            insideVertical: { style: 'nil' },
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'THƯ KÝ CUỘC HỌP',
                                        bold: true,
                                        font: 'Times New Roman',
                                        size: 26,
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: 'CHỦ TRÌ CUỘC HỌP',
                                        bold: true,
                                        font: 'Times New Roman',
                                        size: 26,
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    // --- V. ĐÓNG GÓI TOÀN BỘ VĂN BẢN (CĂN LỀ CHUẨN NGHỊ ĐỊNH 30/2020/NĐ-CP) ---
    const doc = new Document({
        sections: [
            {
                properties: {
                    pageMargins: {
                        top: 1134, // 20mm
                        bottom: 1134, // 20mm
                        left: 1701, // 30mm (Dành lề đóng ghim gáy giấy)
                        right: 850, // 15mm
                    },
                },
                children: [
                    headerTable,
                    new Paragraph({ spacing: { before: 200 } }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'BIÊN BẢN CUỘC HỌP',
                                bold: true,
                                size: 28,
                                font: 'Times New Roman',
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        children: [
                            new TextRun({
                                text: `V/v xác định đối tượng chịu trách nhiệm đền bù thất lạc, hỏng BPBK`,
                                size: 26,
                                bold: true,
                                font: 'Times New Roman',
                            }),
                        ],
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Hôm nay tại ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text:
                                    meetingInfo.location ||
                                    '480f Cao Thắng, phường 12, Quận 10',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: ' vào lúc ',
                                font: 'Times New Roman',
                            }),
                            new TextRun({
                                text: meetingInfo.time || '17h00',
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: ' ngày ',
                                font: 'Times New Roman',
                            }),
                            new TextRun({
                                text: meetingInfo.date || '07/06/2026',
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Chủ trì:  Đ/c  ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text:
                                    meetingInfo.chairmanName ||
                                    'Nguyễn Đức Huy',
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: '             Chức vụ ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text:
                                    meetingInfo.chairmanRole ||
                                    'Trưởng Bưu cục',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Thư ký:  Đ/c  ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text:
                                    meetingInfo.secretaryName ||
                                    'Phạm Thị Minh Tân',
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [
                            new TextRun({
                                text: 'Tổng quân số tham gia: ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: `${meetingInfo.totalParticipants || '28'} Đ/c`,
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: ',  Vắng: ',
                                font: 'Times New Roman',
                            }),
                            new TextRun({
                                text: `${meetingInfo.absentCount || '0'} đ/c,`,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 80 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),

                    new Paragraph({
                        indent: { left: 600, hanging: 240 },
                        spacing: { before: 150, after: 100 },
                        children: [
                            new TextRun({
                                text: 'NỘI DUNG',
                                bold: true,
                                size: 26,
                                font: 'Times New Roman',
                            }),
                        ],
                    }),
                    new Paragraph({
                        indent: { left: 360, hanging: 240 },
                        children: [
                            new TextRun({
                                text: '-   ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: 'Họp Bưu cục xác định trách nhiệm đền bù thiệt hại hàng hóa, bưu phẩm theo kết luận số 1777/QĐ-VTPcủa P CSKH ngày 03/ 06 /2021',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        indent: { left: 360, hanging: 240 },
                        children: [
                            new TextRun({
                                text: '-   ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: 'Căn cứ vào BB sự việc/ hiện trạng tại thời điểm phát sinh ngày 26/09/2021',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        indent: { left: 360, hanging: 240 },
                        children: [
                            new TextRun({
                                text: '-   ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: 'Căn cứ vào BB làm việc với khách hàng xác định số tiền đền bù.',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        indent: { left: 360, hanging: 240 },
                        spacing: { after: 150 },
                        children: [
                            new TextRun({
                                text: '-   ',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: 'Căn cứ vào quy trình của TCT Cổ phần Bưu chính Viettel',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 80 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),

                    new Paragraph({
                        spacing: { before: 100, after: 100 },
                        children: [
                            new TextRun({
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: 'I - NỘI DUNG CHI TIẾT:',
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),

                    // BẮN TOÀN BỘ CÁC DÒNG DIỄN GIẢI LỖI CHI TIẾT VÀO ĐÂY
                    ...detailedParagraphs,

                    new Paragraph({ spacing: { before: 150, after: 150 } }),

                    new Paragraph({
                        spacing: { before: 200, after: 100 },
                        children: [
                            new TextRun({
                                text: 'Ý kiến của Bưu cục:',
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        indent: { left: 540, hanging: 240 },
                        children: [
                            new TextRun({
                                text: ' Ý kiến của đ/c chủ trì: quy trách nhiệm cá nhận, thực hiện đền bù đúng số tiền trên trừ vào lương tháng 05/2026- Trưởng bưu cục.Nguyễn Đức Huy',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),
                    new Paragraph({
                        indent: { left: 540, hanging: 240 },
                        children: [
                            new TextRun({
                                text: ' Ý kiến của các cá nhân khác: Không ý kiến.',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),
                    new Paragraph({
                        indent: { left: 640, hanging: 240 },
                        children: [
                            new TextRun({
                                text: 'Ý kiến của các đối tượng liên quan:',
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                            new TextRun({
                                text: 'đồng ý với nội dung trên.',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),
                    new Paragraph({
                        indent: { left: 640, hanging: 240 },
                        children: [
                            new TextRun({
                                text: 'Sinh hoạt tập thể thống nhất quy TNCN các khoản đề bù cụ thể như sau:',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),

                    // BẢNG SỐ LIỆU ĐỦ TIÊU ĐỀ HEADER MÀU ĐEN TRẮNG TRUYỀN THỐNG
                    mainDataTable,

                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),

                    new Paragraph({
                        spacing: { before: 150, after: 100 },
                        children: [
                            new TextRun({
                                text: 'II - KẾT LUẬN',
                                bold: true,
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),
                    new Paragraph({
                        bullet: { level: 0 },
                        children: [
                            new TextRun({
                                text: 'Tất cả các thành viên tham gia cuộc họp thống nhất 100% với các nội dung biên bản nêu trên.',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),
                    new Paragraph({
                        bullet: { level: 0 },
                        children: [
                            new TextRun({
                                text: 'Yêu cầu các đ/c có tên trong danh sách thực hiện nộp đủ số tiền đền bù trong vòng 03 ngày kể từ ngày lập biên bản này về tài khoản chuyên thu của Chi nhánh hoặc phòng Tài chính chính (PTC) Chi nhánh.',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),
                    new Paragraph({
                        bullet: { level: 0 },
                        children: [
                            new TextRun({
                                text: 'Đối với trường hợp số tiền đền bù lớn (> 3 triệu đồng), cá nhân có quyền làm đơn đề nghị được khấu trừ từng phần vào lương/thưởng theo quy định của Tổng Công ty.',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: '' })],
                        spacing: { before: 0, after: 120 }, // Tạo độ giãn cách dòng trống vừa vặn
                    }),
                    new Paragraph({
                        bullet: { level: 0 },
                        spacing: { after: 300 },
                        children: [
                            new TextRun({
                                text: 'Cá nhân có trách nhiệm hoàn thiện bản ủy quyền trừ lương/thưởng/thù lao (theo mẫu quy định) gửi về BTC Chi nhánh trong vòng 01 ngày kể từ khi kết thúc cuộc họp này.',
                                font: 'Times New Roman',
                                size: 26,
                            }),
                        ],
                    }),

                    new Paragraph({ spacing: { before: 300 } }),
                    signatureTable,
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Bien_Ban_Den_Bu.docx`);
};
