"use client";

import React, { useState, useEffect } from 'react';
import Image from '../../../public/images/logo.png'
import LocationIcon from '../../../public/images/locationIcon.png'
import FlagIcon from '../../../public/images/flagIcon.png'
import dashboardStars from '../../../public/images/dashboardStars.png'
import placeholder from '../../../public/images/placeholderCalendar.png'

const Home: React.FC = () => {
    return(
        <div className="flex flex-row">
            <section className="flex flex-col w-128 mt-20 rounded-tr-lg items-center bg-[#ffffff] border-[#CBD7DF] border-1">
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
            <section className="flex flex-col mx-8">
                <section>
                    <div className="flex flex-row gap-8">
                        <a>Overview</a>
                        <a>Skill Exchange</a>
                        <a>Portfolio</a>
                        <a>Reviews</a>
                    </div>
                </section>
                <section>
                    <div className="swapOrangeBg flex flex-row px-8 py-4 h-64 text-white rounded-xl">
                        <div>
                            <p className="mb-6">LEARN. SHARE. CONNECT.</p>
                            <p className="text-white text-3xl font-semibold break-words">Build your skills bank — one swap at a time.</p>
                            <button
                                className="mt-8 p-6 rounded-full bg-[#171717]"
                            >
                                Join Now

                            </button>
                        </div>
                        <img 
                            src={dashboardStars.src}
                            className="overflow h-72 -mt-8 ml-8"
                        />
                    </div>
                </section>  
            </section>
            <img
                src={placeholder.src}
            />

        </div>
    );
}

export default Home;