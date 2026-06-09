'use client';
import { useFormik } from 'formik';
import { useState } from 'react';
import Person from './person';
import { exportFullAdministrativeDocx } from './HeaderDocx';

const Report = () => {
    const [date, setDate] = useState(new Date());
    const [list, setList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const formatNumber = (num) => {
        if (num === undefined || num === null || isNaN(num)) return '0';

        // Ép kiểu về số phòng trường hợp dữ liệu đầu vào là chuỗi chuỗi "123456"
        return Number(num).toLocaleString('en-US');
    };

    const handleExportDocx = () => {
        const formatDate = (date) => {
            if (!date) return '';
            // Ép kiểu về dạng date nếu truyền vào là chuỗi string hoặc timestamp
            const d = new Date(date);
            return d.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        };
        const meetingInfo = { date: formatDate(date) };

        exportFullAdministrativeDocx(list, meetingInfo);
        setList([]);
    };

    const handleEdit = (index) => {
        const itemToEdit = list[index];

        formik.setValues({
            name: itemToEdit.name,
            route: itemToEdit.route,
            role: itemToEdit.role || 'NVBT',
            amount: Number(itemToEdit.amount.replace(/,/g, '')) || 0,
            reason: itemToEdit.reason,
        });

        setEditingIndex(index); // Ghim vị trí index đang sửa lại đây
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            route: 'HBQN10',
            role: 'NVBT',
            amount: 0,
            reason: 'không tuân thủ đúng quy trình khai thác',
        },
        onSubmit: (values, { resetForm }) => {
            if (editingIndex !== null) {
                const values = formik.values;

                // Tiến hành cập nhật đè trực tiếp vào vị trí index đang sửa
                const updatedList = list.map((item, index) => {
                    if (index === editingIndex) {
                        return {
                            name: values.name,
                            route: values.route,
                            role: values.role || 'NVBT',
                            amount: formatNumber(values.amount), // Định dạng lại dấu phẩy
                            reason: values.reason,
                        };
                    }
                    return item;
                });

                setList(updatedList); // Cập nhật danh sách mới sạch sẽ
                setEditingIndex(null); // Thoát chế độ sửa, đưa về chế độ thêm
                formik.resetForm(); // Xóa sạch ô nhập
            } else {
                setList([
                    ...list,
                    { ...values, amount: formatNumber(values.amount) },
                ]);
                resetForm();
            }
        },
    });
    return (
        <div className="bg-primary flex h-screen justify-center">
            <div className="flex min-w-1/2 flex-col">
                <input
                    className="text-size-primary mt-4 mb-4 w-40 cursor-pointer rounded-xs border p-2 text-white [&::-webkit-calendar-picker-indicator]:invert"
                    type="date"
                    value={date.toISOString().split('T')[0]}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    onClick={(e) => e.target.showPicker()}
                />
                <form
                    className="flex flex-row gap-4"
                    onSubmit={formik.handleSubmit}
                >
                    <div className="w-full">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand placeholder:text-body block min-w-full border px-3 py-2.5 text-sm shadow-xs"
                            placeholder="Name"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            id="route"
                            name="route"
                            value={formik.values.route}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand placeholder:text-body block w-24 border px-3 py-2.5 text-sm shadow-xs"
                            placeholder="Post Office"
                            required
                        />
                    </div>
                    <div>
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand placeholder:text-body block w-30 [appearance:textfield] border px-3 py-2.5 text-sm shadow-xs [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            placeholder="Price"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-size-primary hover:bg-hover w-fit cursor-pointer rounded-xs border p-2 font-medium transition-all duration-300"
                    >
                        {editingIndex !== null ? 'Lưu' : 'Thêm'}
                    </button>
                </form>

                {/*  */}

                <div className='[&::-webkit-scrollbar-track]:bg-hover dark:[&::-webkit-scrollbar-track]:bg-hover dark:[&::-webkit-scrollbar-thumb]:bg-hover" mt-8 flex max-h-8/12 flex-col gap-2 overflow-y-auto px-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white [&::-webkit-scrollbar-track]:rounded-full'>
                    {list.map((item, index) => (
                        <Person
                            key={index}
                            name={item.name}
                            route={item.route}
                            amount={item.amount}
                            onEdit={() => handleEdit(index)}
                        />
                    ))}
                </div>
                {/*  */}
                {list.length > 0 && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleExportDocx}
                            className="hover:bg-hover mt-4 w-14 cursor-pointer rounded-xs border p-2 transition-all duration-300"
                        >
                            In
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;
