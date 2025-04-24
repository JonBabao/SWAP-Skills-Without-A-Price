import React from 'react';

interface ButtonProperties {
    children: React.ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean; 
}

const BlackButton: React.FC<ButtonProperties> = ({ children, onClick, style, type = 'button', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="cursor-pointer text-white font-bold rounded-lg py-4 px-6 flex items-center justify-center bg-[#0f0f0f] hover:bg-[#2d2d2d] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={style}
        >
            {children}
        </button>
    );
};

export default BlackButton;
