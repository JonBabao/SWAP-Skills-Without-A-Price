"use client";
import React, { useState, useEffect } from 'react';
import logo from '../../../public/images/logo.png';
import searchIcon from '../../../public/images/search icon.png';
import ProfileIcon from '../../../public/images/man 1.png';
import Notifcation from '../../../public/images/notification.png';
import MessageIcon from '../../../public/images/message.png';
import UploadButton from '../../../public/images/upload.png';
import AddButton from '../../../public/images/add btn.png';
import SaveButton from '../../../public/images/save btn.png';
import EditProfileButton from '../../../public/images/edit photo.png';

const EditProfile: React.FC = () => {
    return (
        <>
            {/* Di pa sure if goods sya tignan sa inyo hehe */}
            <div className="seashell w-[1920px] h-[150px] relative">
                <img src="/images/logo.png" className="absolute left-[43px] top-[28px] w-16 h-[55px]" />
                <div className="absolute left-[136px] top-[24px] w-[712px] h-[63px] bg-white rounded-[5px] flex items-center px-6 shadow-sm border border-[0.5px] border-[#BFB6B6]">
                    <img src="/images/search icon.png" alt="Search" className="w-5 h-5 mr-3" />
                    <input type="text" placeholder="Search" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500" />
                </div>
                <img src="/images/message.png" alt="Message" className="absolute left-[1629px] top-[33px] w-[45px] h-[45px] cursor-pointer" />
                <img src="/images/notification.png" alt="Notification" className="absolute left-[1697px] top-[33px] w-[45px] h-[45px] cursor-pointer" />
                <img src="/images/man 1.png" alt="Profile" className="absolute left-[1775px] top-[21px] w-[70px] h-[70px] rounded-full cursor-pointer" />
                <div className="absolute left-[53px] top-[100px] text-[24px] font-semibold text-[#000000]">
                    My Profile &gt; Edit Profile
                </div>
                <img src="/images/save btn.png" alt="Save Button" className="absolute left-[1684px] top-[100px] w-auto h-auto cursor-pointer" />
            </div>

            <div className="w-full px-20 mt-10 flex gap-10 justify-center">
                {/* Left Div */}
                <div className="w-[833px] h-[799px] bg-white shadow rounded-[5px] p-6">
                    <div className="w-[140px] h-[140px] rounded-full overflow-hidden mx-auto mt-[30px] mb-6">
                        <img src="/images/edit photo.png" alt="User Profile" className="w-full h-full object-cover cursor-pointer" />
                    </div>
                    <div className="flex gap-6 mb-4">
                        <div className="flex flex-col">
                            <label className="mb-1 text-base font-medium text-black">First Name</label>
                            <input type="text" className="w-[364px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        </div>
                            <div className="flex flex-col">
                            <label className="mb-1 text-base font-medium text-black">Last Name</label>
                            <input type="text" className="w-[364px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        </div>
                    </div>

                    <div className="flex flex-col mb-4">
                            <label className="mb-1 text-base font-medium text-black">Email</label>
                            <input type="email" className="w-[474px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    </div>
                <div className="flex flex-col mb-4">
                         <label className="mb-1 text-base font-medium text-black">Phone</label>
                         <input type="text" className="w-[474px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                </div>
                <div className="flex flex-col mb-6">
                         <label className="mb-1 text-base font-medium text-black">Address</label>
                         <input type="text" className="w-[474px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                </div>

                <div className="flex gap-6 mb-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-base font-medium text-black">Gender</label>
                        <select className="w-[200px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                        <option></option>
                        <option>Male</option>
                        <option>Female</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-base font-medium text-black">Language</label>
                        <select className="w-[276px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                        <option></option>
                        <option>English</option>
                        <option>Filipino</option>
                        </select>
                    </div>
                    </div>

                    <div className="flex flex-col mb-4">
                            <label className="mb-1 text-base font-medium text-black">Date of Birth</label>
                            <div className="flex gap-4">
                                <select className="w-[200px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                                <option disabled selected>Month</option>
                                {/* Add month options here */}
                                </select>
                                <select className="w-[108px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                                <option disabled selected>Day</option>
                                {/* Add day options here */}
                                </select>
                                <select className="w-[124px] h-[46px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                                <option disabled selected>Year</option>
                                {/* Add year options here */}
                                </select>
                            </div>
                            </div>


                </div>

               {/* Right Div */}
                    <div className="w-[1091px] h-[799px] bg-white shadow rounded-[5px] p-6">
                    <div className="flex flex-col w-full mb-4">
                        <label className="mb-1 text-base font-medium text-black">Bio</label>
                        <input type="text" className="w-[509px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    </div>

                    <p className="mb-1">Skills You Offer</p>
                    <div className="flex gap-4 mb-4">
                        <button className="border border-[0.5px] border-[#BFB6B6] px-4 py-2 rounded-[5px] flex items-center gap-2">
                            <img src={UploadButton.src} alt="Upload" width={20} height={20} />
                            <span>Upload photo</span>
                        </button>
                        <input type="text" placeholder="Skill" className="w-[276px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4 placeholder-black"
                        />
                        <button>
                            <img src={AddButton.src} alt="Add" width={30} height={30} />
                        </button>
                    </div>


                    <p className="mb-1">Skills You Want To Learn</p>
                    <div className="flex gap-4 mb-4">
                        <input type="text" placeholder="Skill" className="w-[276px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4 placeholder-black" />
                        <button>
                        <img src={AddButton.src} alt="Add Skill" width={30} height={30} />
                        </button>
                    </div>

                    <p className="mb-1">Your Works</p>
                    <div className="flex gap-4 mb-4">
                        <button className="border border-[0.5px] border-[#BFB6B6] px-4 py-2 rounded-[5px] flex items-center gap-2">
                            <img src={UploadButton.src} alt="Upload Work" width={20} height={20} />
                            <span>Upload work samples</span>
                        </button>
                        <input
                            type="text"
                            placeholder="Skill"
                            className="w-[228px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4 placeholder-black"
                        />
                        <select className="w-[200px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4">
                            <option>Date Accomplished</option>
                        </select>
                        <button>
                            <img src={AddButton.src} alt="Add Work" width={30} height={30} />
                        </button>
                    </div>


                    <div className="flex gap-6 mb-4">
                        <div className="flex flex-col w-full">
                        <label className="mb-1 text-base font-medium text-black">Twitter</label>
                        <input type="text" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        </div>
                        <div className="flex flex-col w-full">
                        <label className="mb-1 text-base font-medium text-black">LinkedIn</label>
                        <input type="text" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        </div>
                    </div>

                    <div className="flex gap-6 mb-4">
                        <div className="flex flex-col w-full">
                        <label className="mb-1 text-base font-medium text-black">Facebook</label>
                        <input type="text" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        </div>
                        <div className="flex flex-col w-full">
                        <label className="mb-1 text-base font-medium text-black">Instagram</label>
                        <input type="text" className="w-full h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                        </div>
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="mb-1 text-base font-medium text-black">Other external links</label>
                        <input type="text" className="w-[509px] h-[45px] border border-[0.5px] border-[#BFB6B6] rounded-[5px] px-4" />
                    </div>
                    </div>
            </div>
        </>
    );
};

export default EditProfile;
