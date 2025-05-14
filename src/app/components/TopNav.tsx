"use client";

import React, { useState, useEffect } from "react";
import Logo from ".././../../public/images/logoBig.png";
import BlackButton from "../styles/blackButton";
import { createClient } from '../../../lib/supabase/client'
import { MessageCircle, Bell, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';


const TopNav: React.FC = () => {

    const supabase = createClient();
    const router = useRouter();

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

      const handleLogout = async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) {
            router.push('/auth/login'); 
            } else {
            console.error('Logout error:', error);
            }
        };

    return(
        <div className="hidden fixed lg:flex flex-row justify-between items-center bg-[#FBF8F2] inset-0 z-50 w-full h-20 text-[#2e2e2e]">
            {userData ? (
                <><div className="flex items-center gap-4">
                    <Link href="/home">
                        <img src={Logo.src} className="h-10 w-12 ml-4" />
                    </Link>
                    <input type="text" placeholder="🔍 Search..." className="px-5 py-3 bg-white rounded-full w-128 focus:outline-none" />
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/sendRequest" className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Plus  />
                    </Link>
                    <Link href="/chat" className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageCircle  />
                    </Link>
                    <button onClick={handleLogout} className="h-10 w-10 p-2 bg-gray-200 rounded-full cursor-pointer" >
                        <LogOut />
                    </button>
                    <Link href='/dashboard'>
                        <img src={userData.avatar_url} className="h-12 w-12 rounded-full mr-8" />
                    </Link>
                    
                </div></>
            ) : (<p>Loading Page</p>)}   
            
        </div>
    );
}

export default TopNav;
