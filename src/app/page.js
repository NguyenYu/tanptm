'use client';

import { useFormik } from 'formik';
import { useState } from 'react';
import { ArrowRight, FileDown, FileText, Pencil, Plus, Receipt, Sparkles, Trash2, X } from 'lucide-react';
import Person from './person';
import { exportFullAdministrativeDocx } from './HeaderDocx';

const emptyValues = { name: '', route: 'HBQN10', amount: '' };

export default function Report() {
    const [date] = useState(new Date());
    const [list, setList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fileName, setFileName] = useState('');

    const formatNumber = (num) => Number(num || 0).toLocaleString('vi-VN');
    const formatDate = (value) => new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const total = list.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const formik = useFormik({
        initialValues: emptyValues,
        onSubmit: (values, { resetForm }) => {
            if (editingIndex !== null) {
                setList((current) => current.map((item, index) => index === editingIndex ? values : item));
                setEditingIndex(null);
            } else {
                setList((current) => [...current, values]);
            }
            resetForm({ values: emptyValues });
        },
    });

    const handleEdit = (index) => {
        formik.setValues(list[index]);
        setEditingIndex(index);
    };

    const handleDelete = (index) => {
        setList((current) => current.filter((_, itemIndex) => itemIndex !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
            formik.resetForm({ values: emptyValues });
        }
    };

    const handleExport = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 700));
        try {
            exportFullAdministrativeDocx(list, { date: formatDate(date) });
            const generatedFileName = `Bien_Ban_Boi_Hoan_${formatDate(date).replaceAll('/', '-')}.docx`;
            setFileName(generatedFileName);
            setList([]);
            setEditingIndex(null);
            setShowModal(true);
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi tạo file!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
            {isLoading && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm"><div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-xl"><span className="size-5 animate-spin rounded-full border-2 border-pink-100 border-t-pink-600" /> Đang khởi tạo file Word...</div></div>}
            {showModal && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600"><FileText /></div><h2 className="text-lg font-bold text-slate-900">Xuất file thành công</h2><p className="mt-1 text-sm text-slate-500">Biên bản đã được tải xuống thiết bị.</p></div><button aria-label="Đóng" onClick={() => setShowModal(false)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X /></button></div><div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50/60 p-4 text-sm font-medium break-all text-pink-900">{fileName}</div><button onClick={() => setShowModal(false)} className="mt-5 w-full rounded-xl bg-pink-600 py-3 text-sm font-semibold text-white transition hover:bg-pink-700">Đóng cửa sổ</button></div></div>}

            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700"><Sparkles className="size-3.5" /> Không gian làm việc</div><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Biên bản bồi hoàn</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Tạo danh sách nhân sự và xuất biên bản hành chính nhanh chóng, chính xác.</p></div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><div className="flex size-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600"><Receipt className="size-4" /></div><div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Ngày lập</p><p className="text-sm font-semibold text-slate-800">{formatDate(date)}</p></div></div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                    <div className="mb-7 flex items-center justify-between"><div><h2 className="text-base font-bold text-slate-900">Thêm dữ liệu</h2><p className="mt-1 text-xs text-slate-500">Điền thông tin người bồi hoàn</p></div>{editingIndex !== null && <button type="button" onClick={() => { setEditingIndex(null); formik.resetForm({ values: emptyValues }); }} className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700"><X className="size-3.5" /> Hủy sửa</button>}</div>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5"><label className="flex flex-col gap-2 text-xs font-semibold text-slate-600">Nhân viên bồi hoàn<input name="name" required placeholder="Nhập họ và tên..." onChange={formik.handleChange} value={formik.values.name} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10" /></label><fieldset className="flex flex-col gap-2"><legend className="text-xs font-semibold text-slate-600">Bưu cục</legend><div className="grid grid-cols-2 gap-2">{['HBQN10', 'HCM05'].map((route) => <button key={route} type="button" onClick={() => formik.setFieldValue('route', route)} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${formik.values.route === route ? 'border-pink-600 bg-pink-600 text-white shadow-lg shadow-pink-600/20' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-pink-300 hover:bg-pink-50'}`}>{route}</button>)}</div></fieldset><label className="flex flex-col gap-2 text-xs font-semibold text-slate-600">Số tiền quy trách nhiệm<div className="relative"><input type="number" min="0" name="amount" required placeholder="Nhập số tiền..." onChange={formik.handleChange} value={formik.values.amount} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-14 pl-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10" /><span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-bold text-pink-600">VND</span></div></label><button type="submit" className={`mt-1 inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition active:scale-[.99] ${editingIndex !== null ? 'bg-amber-500 hover:bg-amber-600' : 'bg-pink-600 shadow-lg shadow-pink-600/20 hover:bg-pink-700'}`}>{editingIndex !== null ? <Pencil className="size-4" /> : <Plus className="size-4" />}{editingIndex !== null ? 'Cập nhật dòng này' : 'Thêm vào danh sách'}</button></form>
                </section>

                <section className="flex min-h-[520px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-base font-bold text-slate-900">Danh sách bồi hoàn</h2><p className="mt-1 text-xs text-slate-500">{list.length ? `${list.length} nhân sự trong biên bản` : 'Các dòng dữ liệu sẽ xuất hiện tại đây'}</p></div><div className="rounded-2xl bg-pink-50 px-4 py-2 text-right"><p className="text-[10px] font-bold uppercase tracking-wider text-pink-500">Tổng cộng</p><p className="mt-0.5 text-base font-bold text-pink-700">{formatNumber(total)} <span className="text-xs">đ</span></p></div></div>{list.length ? <div className="flex flex-1 flex-col gap-3 overflow-auto">{list.map((item, index) => <div key={`${item.name}-${index}`} onClick={() => handleEdit(index)} className={`group flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition ${editingIndex === index ? 'border-pink-400 bg-pink-50/60' : 'border-slate-100 bg-slate-50/60 hover:border-pink-200 hover:bg-white hover:shadow-sm'}`}><div className="min-w-0 flex-1"><Person name={item.name} route={item.route} amount={item.amount} onEdit={() => handleEdit(index)} /></div><button aria-label={`Xóa ${item.name}`} onClick={(event) => { event.stopPropagation(); handleDelete(index); }} className="rounded-lg p-2 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"><Trash2 className="size-4" /></button></div>)}</div> : <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center"><div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white text-pink-500 shadow-sm"><FileText /></div><p className="text-sm font-semibold text-slate-700">Chưa có dữ liệu</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">Thêm nhân sự ở biểu mẫu bên trái để bắt đầu tạo biên bản.</p></div>}{list.length > 0 && <div className="mt-6 flex justify-end border-t border-slate-100 pt-5"><button onClick={handleExport} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-pink-700"><FileDown className="size-4" /> Xuất biên bản Word <ArrowRight className="size-3.5" /></button></div>}</section>
            </div>
        </main>
    );
}
