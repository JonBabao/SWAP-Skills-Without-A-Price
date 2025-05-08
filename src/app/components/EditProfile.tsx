"use client";
import React, { useState, useEffect } from 'react';
import logo from '../../../public/images/logo.png';
import searchIcon from '../../../public/images/search icon.png';
import ProfileIcon from '../../../public/images/man 1.png';
import Notifcation from '../../../public/images/notification.png';
import MessageIcon from '../../../public/images/message.png';


const EditProfile: React.FC = () => {
    return (
        <div className="seashell w-[1920px] h-[112px] relative">
            <img src="/images/logo.png" className="absolute left-[43px] top-[28px] w-16 h-[55px]" />

            <div className="absolute left-[136px] top-[24px] w-[712px] h-[63px] bg-white rounded-[30px] flex items-center px-6 shadow-sm">
                <img src="/images/search icon.png" alt="Search" className="w-5 h-5 mr-3" />
                <span className="text-gray-500 text-base">Search</span>
            </div>
        </div>
    );
};

export default EditProfile;
