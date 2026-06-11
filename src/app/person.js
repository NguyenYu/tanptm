const Person = ({ name, route, amount }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                {/* Icon nhỏ trang trí */}
                <div className="w-8 h-8 rounded-full bg-[#FFE3E8] flex items-center justify-center text-[#E91E63]">
                    <span className="text-[10px] font-bold">★</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#4A1521]">{name}</span>
                    <span className="text-[10px] font-semibold text-[#9C6D77] uppercase tracking-wider">{route}</span>
                </div>
            </div>
            <div className="text-right">
                <span className="text-sm font-extrabold text-[#C2185B]">
                    {Number(amount).toLocaleString('en-US')}
                </span>
                <span className="text-[9px] font-bold text-[#E91E63] ml-1">VND</span>
            </div>
        </div>
    );
};
export default Person;