"use client";

import React, { useState, useEffect } from "react";
import Logo from ".././../../public/images/logoBig.png";
import BlackButton from "../styles/blackButton";
import { createClient } from '../../../lib/supabase/client'
import { MessageCircle, Bell, Plus } from 'lucide-react';
import Link from 'next/link';

const TopNav: React.FC = () => {

    const supabase = createClient();

    const [userData, setUserData] = useState();

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: auth, error: authError } = await supabase.auth.getUser();

            if (authError || !auth.user) {
                alert("User not logged in. Please log in.")
            } else {
                const authId = auth.user.id;

                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select("*")
                    .eq('id', authId)
                    .single()
                
                setUserData(user);
            }
        };

        fetchUserData();
    }, []);

    return(
        <div className="hidden fixed lg:flex flex-row justify-between items-center bg-[#FBF8F2] inset-0 z-50 w-full h-20 text-[#2e2e2e]">
            {userData ? (
                <><div className="flex items-center gap-4">
                    <img src={Logo.src} className="h-10 w-12 ml-4" />
                    <input type="text" placeholder="🔍 Search..." className="px-5 py-3 bg-white rounded-full w-128 focus:outline-none" />
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/sendRequest" className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Plus  />
                    </Link>
                    <Link href="/chat" className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageCircle  />
                    </Link>
                    <Link href='/' className="h-10 w-10 p-2 bg-gray-200 rounded-full" >
                        <Bell />
                    </Link>
                    <Link href='/dashboard/home'>
                        <img src={userData.avatar_url} className="h-12 w-12 rounded-full mr-8" />
                    </Link>
                    
                </div></>
            ) : (<p>Loading Page</p>)}   
            
        </div>
    );
}

export default TopNav;
