"use client";

import React, { useState, useEffect } from "react";
import Logo from ".././../../public/images/logo.png";
import BlackButton from "../styles/blackButton";

const TopNav: React.FC = () => {

    return(
        <nav className="fixed lg:flex flex-row items-center bg-[#FDFCF9]/75 inset-0 z-50 w-full h-20 text-[#2e2e2e]">
            <div className="flex flex-grow flex-row items-center ml-6">
                <img src={Logo.src} alt="logo" />
                <p className="montserrat font-extrabold text-lg ml-2">SWAP: Skills Without A Price</p>
            </div>
            <div className="flex flex-row font-semibold items-center p-8">
                <a className="p-7">Home</a>
                <a className="p-7">About Us</a>
                <a className="p-7">Our Team</a>
                <BlackButton style={{ padding: "10px 30px 10px 30px" }}>Log In</BlackButton>
            </div>
        </nav>
    );
}

export default TopNav;
