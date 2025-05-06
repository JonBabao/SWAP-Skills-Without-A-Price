"use client";

import React, { useState, useEffect } from 'react';
import Image from '../../../public/images/logo.png'
import LocationIcon from '../../../public/images/locationIcon.png'
import FlagIcon from '../../../public/images/flagIcon.png'
import dashboardStars from '../../../public/images/dashboardStars.png'
import placeholder from '../../../public/images/placeholderCalendar.png'
import homeJoinButton from '../../../public/images/homeJoinButton.png'

const Home: React.FC = () => {
    return(
        <div className="flex flex-row">
            <section className="flex flex-col w-118 mt-20 rounded-tr-lg items-center bg-[#ffffff] border-[#CBD7DF] border-1">
                <img src={Image.src}
                    alt="Image"
                />
                <h2>Juan Dela Cruz</h2>
                <p>jdl@gmail.com</p>
                {/* insert logos here */}
                <p>Creative freelancer passionate about design and language learning. Here to share my Photoshop and Canva knowledge while picking up French and public speaking skills!</p>
                <hr className="h-2 "/>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <img src={LocationIcon.src} />
                        <p>Location</p>
                        <p className="flex-grow">Batangas City, Philippines</p>
                    </div>
                    <div className="flex flex-row">
                        <img src={FlagIcon.src} />
                        <p>Language</p>
                        <p className="flex-grow">English</p>
                    </div>
                </div>
                <hr className="h-2 "/>
                <div>
                    <h3>Skills Offered</h3>
                    {/* Insert Horizontal Scrollable Here */}
                </div>
                <div>
                    <h3>Skills Wanted</h3>
                    <div className="py-2 px-4 bg-gray-400">
                        <p>Language 1</p>
                        <p>Language 2</p>
                        <p>Language 3</p>
                    </div>
                </div>
            </section>

            <div className="flex flex-col">
                <nav className="flex flex-row gap-16 bg-white p-4 border-[#CBD7DF] border-1 rounded-xl mx-4 mt-20 mb-4">
                    <a className="ml-8">Overview</a>
                    <a>Skill Exchange</a>
                    <a>Portfolio</a>
                    <a>Reviews</a>
                </nav>
                <div className="flex flex-row">
                    <section className="flex flex-col mx-4"> 
                    
                        <div className="swapOrangeBg flex flex-row px-6 pt-4 pb-4 h-46 text-white rounded-xl overflow-hidden">
                            <div>
                                <p className="mb-4">LEARN. SHARE. CONNECT.</p>
                                <p className="text-white text-2xl font-semibold break-words">Build your skills bank — one swap at a time.</p>
                                <button
                                    className="cursor-pointer text-sm flex flex-row items-center mt-6 px-4 py-4 rounded-full bg-[#171717]"
                                >
                                    Join Now
                                    <div className="ml-2 h-4 w-4 flex-shrink-0">
                                        <img
                                        src={homeJoinButton.src}
                                        alt="Join Icon"
                                        className="h-full w-full object-contain"
                                        />
                                    </div>
                                </button>
                            </div>
                            <img
                                src={dashboardStars.src}
                                alt="Stars"
                                className="h-72 object-contain -mt-14"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="font-semibold my-2">Session History</p>
                            <div className="bg-white rounded-lg px-8 pb-8">
                                <table className="min-w-full text-xs text-left text-gray-700">
                                    <thead >
                                        <tr className="text-center">
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Skill</th>
                                        <th className="px-4 py-2">Learner</th>
                                        <th className="px-4 py-2">Mentor</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody className="px-8">
                                        <tr className="border-b">
                                            <td className="px-4 py-2">Apr 20, 2025</td>
                                            <td className="px-4 py-2">Photo Editing</td>
                                            <td className="px-4 py-2">Gab Garcia</td>
                                            <td className="px-4 py-2">You</td>
                                            <td className="px-4 py-2">
                                                <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                                                Completed
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-yellow-400">
                                                ★ ★ ★ ★ ☆
                                            </td>
                                        </tr>
                                        <tr className="border-b">
                                        <td className="px-4 py-2">Apr 12, 2025</td>
                                        <td className="px-4 py-2">French Language</td>
                                        <td className="px-4 py-2">You</td>
                                        <td className="px-4 py-2">Eloise Martin</td>
                                        <td className="px-4 py-2">
                                            <span className="bg-red-200 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                                            Cancelled
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-black font-bold text-lg">—</td>
                                        </tr>
                                        <tr className="border-b">
                                        <td className="px-4 py-2">Apr 9, 2025</td>
                                        <td className="px-4 py-2">Resume Writing</td>
                                        <td className="px-4 py-2">Maria Reyes</td>
                                        <td className="px-4 py-2">You</td>
                                        <td className="px-4 py-2">
                                            <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                                            Completed
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-yellow-400">
                                            ★ ★ ★ ★ ★
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>      
                            </div>
                                        
                        </div>
                    </section>
                    <img
                        src={placeholder.src}
                        className="w-1/4"
                    />
                </div>
                
                   
            </div>
            
        </div>
    );
}

export default Home;