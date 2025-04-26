"use client";

import React, { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import Link from "next/link";
import AuthImage from "../../../public/images/authimage.png";
import Logo from "../../../public/images/logoBig.png"
import OrangeButton from '../styles/orangeButton';
import GoogleSignInButton from './GoogleSignIn';
import LinkedInSignInButton from './LinkedInSignIn'
import Blob from "../../../public/images/blobRegister.png"

const Register: React.FC = () => {
    const supabase = createClient();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        if (!username.trim()) {
            setError("Username is required.");
            return;
        }
    
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
    
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } }
        });

        if (signUpError) {
            setError(signUpError.message);
            return;
        }
    
        if (data.user && !data.session) {
            console.log("Email confirmation required before authentication.");
            setSuccess("Check your email to confirm your account before logging in.");
            return;
        }
    
        setSuccess("Registration successful! Check your email for confirmation.");
    };

    const handleGoogleLogin = async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`
            }
          })
    
          if (error) throw error
        } catch (error) {
          console.error('Error signing in with Google:', error)
          alert('Error signing in with Google')
        }
      }

    return(
        <div className="flex flex-row">
            <img 
                src={AuthImage.src}
                alt="Auth Image"
                className="h-screen w-[50vw]"
            />

            <section className="flex flex-col items-center px-36 text-center w-full">
                <img
                    src={Logo.src}
                    alt="Logo"
                    className="self-start -ml-36"
                />
                <h2 className="montserrat text-5xl font-bold">Join the SWAP Community</h2>
                <p className="my-4">Let's turn skill into shared success.</p>

                <img 
                    src={Blob.src}
                    className="absolute right-0 scale-75 -mr-12 mt-22"
                />


                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Full Name"
                        className="w-96 px-4 py-2 mb-2 border-1 border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-96 px-4 py-2 mb-2 border-1 border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-96 px-4 py-2 mb-2 border-1 border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-96 px-4 py-2 mb-2 border-1 border-gray-300 rounded-lg"
                        required
                    />

                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <OrangeButton type="submit" style={{ height: "3rem"}}>Create Account</OrangeButton>
                </form>
                <div className="flex flex-row my-4 items-center">
                    <hr className="w-38" />
                    <p className="px-6">OR</p>
                    <hr className="w-38" />
                </div>
                <div className="space-y-2">
                    <GoogleSignInButton />
                    <LinkedInSignInButton />
                </div>
                
                <p className="mt-4">Already have an account?&nbsp; 
                    <Link href="/auth/login" className="text-blue-700">
                        Log In
                    </Link>
                </p>
                
            </section>
            
        </div>
        
    );
};

export default Register;