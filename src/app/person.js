import React from 'react';

const Person = ({ name, route, amount, onEdit }) => {
    return (
        <div className="flex flex-row gap-4">
            <div className="flex w-full flex-row justify-between gap-14 rounded-xs border p-2">
                <h3 className="text-size-primary font-medium">{name}</h3>
                <p className="text-size-primary font-medium">{route}</p>
                <p className="text-size-primary font-medium">{amount}</p>
            </div>
            <button
                onClick={onEdit}
                className="hover:bg-hover w-14 rounded-xs border p-2 transition-all duration-300"
            >
                Sửa
            </button>
        </div>
    );
};

export default Person;
