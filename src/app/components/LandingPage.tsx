"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '../../../lib/supabase/client';
import HomeImage from "../../../public/images/home_image.png"
import OrangeButton from "../styles/orangeButton";
import ShareKnowledge from "../../../public/images/shareKnowledgeImage.png"
import BrowseSkills from "../../../public/images/browseSkillsImage.png"
import RequestExchange from "../../../public/images/requestExchangeImage.png"
import SignUpImage from "../../../public/images/signUpImage.png"
import Line from "../../../public/images/line.png"
import { useRouter } from "next/navigation";
import BlackButton from '../styles/blackButton'
import Logo from ".././../../public/images/logo.png";


const LandingPage: React.FC = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkIfAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
      } else {
        setIsAuth(true);
      }


    }
    checkIfAuth()
  }, [])

  const handleGetStarted = () => {
    router.push('/auth/register')
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
    
      setIsAuth(false);
    
      router.push('/login'); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#FDFCF9]">
      <nav className="hidden fixed lg:flex flex-row items-center bg-[#FDFCF9]/75 inset-0 z-50 w-full h-20 text-[#2e2e2e]">
        <div className="flex flex-grow flex-row items-center ml-6">
            <img src={Logo.src} alt="logo" />
            <p className="montserrat font-extrabold text-lg ml-2">SWAP: Skills Without A Price</p>
        </div>
        <div className="flex flex-row font-semibold items-center p-8">
            <a href="/home" className="p-7">Home</a>
            <a className="p-7">About Us</a>
            <a className="p-7">Our Team</a>
            {isAuth ? (
              <BlackButton onClick={handleLogout} style={{ padding: "10px 30px 10px 30px" }}>Logout</BlackButton>
                ) : (<BlackButton onClick={handleLogin} style={{ padding: "10px 30px 10px 30px" }}>Login</BlackButton>)}
            
        </div>
      </nav>
      <section className="flex flex-row items-center justify-center">
        <div className="flex flex-col text-left text-lg items-start w-1/2 py-8 pl-24 gap-4 mt-32">
          <p className="montserrat text-6xl font-bold">Unlock Potential, Not Wallets</p>
          <p>Join a vibrant community where knowledge is currency. Learn, share, and grow — together.</p>
          <OrangeButton 
            onClick={handleGetStarted}
            style={{ padding: "20px 80px 20px 80px", marginTop: "2rem" }}
            >
              Get Started
          </OrangeButton>
        </div>
        <div className="flex w-1/2 items-center justify-center">
          <img 
            src={HomeImage.src}
            alt="Home Image"
            className="w-[43rem] mt-8"
          />
        </div>
      </section>

      <section className="flex flex-col items-center mx-16">
        <h2 className="montserrat text-6xl font-bold">How it Works</h2>
        <p className="mt-4 text-lg w-[45rem] text-center">Discover how SWAP enables users to exchange knowledge without the use of money. Follow these simple steps to start sharing your skills on the platform:</p>
        <div className="flex flex-row flex-wrap items-center justify-center mt-16 mb-16">
          {/* Sign Up */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={SignUpImage.src}
              alt="Sign Up Image"
              className="-mt-6 scale-75"
            />
            <div className="seashell flex flex-col justify-center pl-6 pr-4 pb-8 pt-4 rounded-lg mt-6 h-56 w-72 mx-10 lg:mx-0 mb-16">
              <h3 className="montserrat swapOrangeText text-3xl font-bold mb-6">Sign Up</h3>
              <p>Create an account on SWAP to access a diverse community of learners and educators</p>
            </div>
          </div>

          <img
            src={Line.src}
            className="hidden lg:block -mt-79 -mx-18 scale-65"
          />

          {/* Browse Skills */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={BrowseSkills.src}
              alt="Browse Skills Image"
              className="scale-75"
            />
            <div className="seashell flex flex-col justify-center px-6 pb-8 pt-4 rounded-lg mt-6 h-56 w-72 mx-10 lg:mx-0 mb-16">
              <h3 className="montserrat swapOrangeText text-3xl font-bold mb-6">Browse Skills</h3>
              <p>Explore a wide range of skills offered by others users on SWAP, from cooking to coding.</p>
            </div>
          </div>

          <img
            src={Line.src}
            className="hidden lg:block -mt-79 -mx-18 scale-65"
          />

          {/* Request A Skill Exchange */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={RequestExchange.src}
              alt="Request A Skill Exchange Image"
              className="scale-75"
            />
            <div className="seashell flex flex-col justify-center px-6 pb-8 pt-4 rounded-lg mt-6 h-56 w-72 mx-10 lg:mx-0 mb-16">
              <h3 className="montserrat swapOrangeText text-3xl font-bold mb-6">Request A Skill Exchange</h3>
              <p>Send a request to exchange knowledge with another user based on your interests and expertise.</p>
            </div>
          </div>

          <img
            src={Line.src}
            className="hidden lg:block -mt-79 -mx-18 scale-65"
          />

          {/* Share Your Knowledge */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={ShareKnowledge.src}
              alt="Share Your Knowledge Image"
              className="scale-75"
            />
            <div className="seashell flex flex-col justify-center px-6 pb-8 pt-4 rounded-lg mt-6 h-56 w-72 mx-10 lg:mx-0 mb-16">
              <h3 className="montserrat swapOrangeText text-3xl font-bold mb-6">Share Your Knowledge</h3>
              <p>Contribute to the community by sharing your skills and expertise with others on SWAP.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
