"use client";
import React, { useState, useEffect } from 'react';
import logo from '../../../public/images/logo.png';
import searchIcon from '../../../public/images/search icon.png';
import ProfileIcon from '../../../public/images/man 1.png';
import Notifcation from '../../../public/images/notification.png';
import MessageIcon from '../../../public/images/message.png';

const EditProfile: React.FC = () => {
    return (
        <>
        {/* Hindi pa to okay aayusin ko pa*/}
            <div className="seashell w-[1920px] h-[112px] relative">
                <img src="/images/logo.png" className="absolute left-[43px] top-[28px] w-16 h-[55px]" />
                <div className="absolute left-[136px] top-[24px] w-[712px] h-[63px] bg-white rounded-[5px] flex items-center px-6 shadow-sm border border-[0.5px] border-[#BFB6B6]">
                    <img src="/images/search icon.png" alt="Search" className="w-5 h-5 mr-3" />
                    <input type="text" placeholder="Search" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500" />
                </div>
                <img src="/images/message.png" alt="Message" className="absolute left-[1629px] top-[33px] w-[45px] h-[45px] cursor-pointer" />
                <img src="/images/notification.png" alt="Notification" className="absolute left-[1697px] top-[33px] w-[45px] h-[45px] cursor-pointer" />
                <img src="/images/man 1.png" alt="Profile" className="absolute left-[1775px] top-[21px] w-[70px] h-[70px] rounded-full cursor-pointer" />
            </div>

            <div className="w-full px-20 mt-10 flex gap-10 justify-center">
                {/* Left Div */}
                <div className="w-[833px] h-[799px] bg-white shadow rounded-[5px] p-6">
                    <div className="w-[140px] h-[140px] rounded-full overflow-hidden mx-auto mt-[30px] mb-6">
                        <img src="/images/man 1.png" alt="User Profile" className="w-full h-full object-cover cursor-pointer" />
                    </div>
                    <div className="flex gap-6 mb-4">
                        <input type="text" placeholder="First Name" className="w-[364px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        <input type="text" placeholder="Last Name" className="w-[364px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    </div>
                    <input type="email" placeholder="Email" className="w-[474px] h-[45px] mb-4 border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    <input type="text" placeholder="Phone" className="w-[474px] h-[45px] mb-4 border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    <input type="text" placeholder="Address" className="w-[474px] h-[45px] mb-6 border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    <div className="flex gap-6 mb-4">
                        <select className="w-[200px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                            <option>Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                        <select className="w-[276px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                            <option>Language</option>
                            <option>English</option>
                            <option>Filipino</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <select className="w-[200px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                            <option>Month</option>
                        </select>
                        <select className="w-[108px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                            <option>Day</option>
                        </select>
                        <select className="w-[124px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                            <option>Year</option>
                        </select>
                    </div>
                </div>

                {/* Right Div */}
                <div className="w-[833px] h-[799px] bg-white shadow rounded-[5px] p-6">
                    <input type="text" placeholder="Bio" className="w-full h-[45px] mb-4 border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />

                    <p className="mb-1">Skills You Offer</p>
                    <div className="flex gap-4 mb-4">
                        <button className="border border-[0.5px] border-[#BFB6B6] px-4 py-2 rounded-[5px]">⬆️ Upload photo</button>
                        <input type="text" placeholder="Skill" className="w-[276px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        <button className="text-red-500">🗑</button>
                    </div>

                    <p className="mb-1">Skills You Want To Learn</p>
                    <div className="flex gap-4 mb-4">
                        <input type="text" placeholder="Skill" className="w-[276px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        <button className="text-red-500">➕</button>
                    </div>

                    <p className="mb-1">Your Works</p>
                    <div className="flex gap-4 mb-4">
                        <button className="border border-[0.5px] border-[#BFB6B6] px-4 py-2 rounded-[5px]">⬆️ Upload work samples</button>
                        <input type="text" placeholder="Skill" className="w-[200px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        <select className="w-[200px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                            <option>Date Accomplished</option>
                        </select>
                        <button className="text-red-500">➕</button>
                    </div>

                    <div className="flex gap-6 mb-4">
                        <input type="text" placeholder="Twitter" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        <input type="text" placeholder="LinkedIn" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    </div>

                    <div className="flex gap-6 mb-4">
                        <input type="text" placeholder="Facebook" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        <input type="text" placeholder="Instagram" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    </div>

                    <input type="text" placeholder="Other external links" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                </div>
            </div>
        </>
    );
};

export default EditProfile;
