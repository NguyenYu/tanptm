/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';

export default function ExtensionPrintPage() {
    const [tabsList, setTabsList] = useState([]);
    const [selectedTabIds, setSelectedTabIds] = useState({});
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Quét toàn bộ các tab khi mở Extension
    useEffect(() => {
        if (!isClient) return;

        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                // Lọc bỏ tab hệ thống
                const validTabs = tabs.filter(
                    (tab) => tab.url && !tab.url.startsWith('chrome://'),
                );
                setTabsList(validTabs);

                // Chọn sẵn tất cả các tab
                const initialSelect = {};
                validTabs.forEach((tab) => {
                    initialSelect[tab.id] = true;
                });
                setSelectedTabIds(initialSelect);
            });
        } else {
            // Dữ liệu mẫu để anh test giao diện ở localhost
            setTabsList([
                { id: 1, title: 'Hóa đơn PDF 01 - Trang web khác' },
                { id: 2, title: 'Hóa đơn PDF 02 - Trang web khác' },
            ]);
            setSelectedTabIds({ 1: true, 2: true });
        }
    }, [isClient]);

    const handleToggleSelect = (tabId) => {
        setSelectedTabIds((prev) => ({ ...prev, [tabId]: !prev[tabId] }));
    };

    // Bơm lệnh in và CSS căn giữa A7 vào các tab đang mở
    const handlePrintSelectedTabs = async () => {
        const idsToPrint = Object.keys(selectedTabIds).filter(
            (id) => selectedTabIds[id],
        );
        if (idsToPrint.length === 0)
            return alert('Vui lòng chọn ít nhất 1 tab!');

        if (typeof chrome !== 'undefined' && chrome.scripting) {
            for (let idStr of idsToPrint) {
                const tabId = parseInt(idStr, 10);
                await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                        const style = document.createElement('style');
                        style.innerHTML = `
                            @media print {
                                @page { size: 74mm 105mm; margin: 0; }
                                html, body { 
                                    margin: 0; padding: 0; 
                                    width: 74mm; height: 105mm; 
                                    display: flex; align-items: center; justify-content: center;
                                    background: #ffffff;
                                }
                            }
                        `;
                        document.head.appendChild(style);
                        window.print();
                    },
                });
            }
        } else {
            alert(
                'Tính năng in hàng loạt sẽ hoạt động khi anh cài vào Chrome Extension.',
            );
        }
    };

    if (!isClient) return null;

    return (
        <div
            style={{
                width: '380px',
                padding: '16px',
                fontFamily: 'system-ui, sans-serif',
                background: '#fdf2f8',
            }}
        >
            <h3
                style={{
                    margin: '0 0 6px 0',
                    color: '#db2777',
                    fontSize: '16px',
                    fontWeight: 'bold',
                }}
            >
                🖨️ Hệ Thống In Hàng Loạt
            </h3>
            <p
                style={{
                    margin: '0 0 16px 0',
                    fontSize: '11px',
                    color: '#64748b',
                }}
            >
                Tự động ép cấu trúc khổ dọc A7 giữa cho tất cả các tab được
                chọn.
            </p>

            <div
                style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #fbcfe8',
                    padding: '8px',
                }}
            >
                {tabsList.map((tab) => (
                    <div
                        key={tab.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 0',
                            borderBottom: '1px solid #fdf2f8',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={!!selectedTabIds[tab.id]}
                            onChange={() => handleToggleSelect(tab.id)}
                            style={{
                                marginRight: '10px',
                                accentColor: '#db2777',
                                cursor: 'pointer',
                            }}
                        />
                        <span
                            style={{
                                fontSize: '12px',
                                color: '#334155',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                flex: 1,
                            }}
                        >
                            {tab.title}
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={handlePrintSelectedTabs}
                style={{
                    marginTop: '16px',
                    width: '100%',
                    padding: '10px',
                    background: '#db2777',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    cursor: 'pointer',
                }}
            >
                🚀 Kích Hoạt In Loạt Tab (Khổ A7 Giữa)
            </button>
        </div>
    );
}
