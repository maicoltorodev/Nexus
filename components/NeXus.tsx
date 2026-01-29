import React from 'react';

interface NeXusProps {
    className?: string;
    showXOnly?: boolean;
}

const NeXus = ({ className = "" }: NeXusProps) => {
    return (
        <span className={className}>
            NE<span className="text-[#FFD700] font-black italic-none">X</span>US
        </span>
    );
};

export default NeXus;
