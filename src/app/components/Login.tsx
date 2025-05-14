"use client";

import React, { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import GoogleSignInButton from './GoogleSignIn';
import LinkedInSignInButton from './LinkedInSignIn';
import AuthImage from '../../../public/images/authimage.png'
import Blob from '../../../public/images/blobRegister.png'
import Logo from '../../../public/images/logoBig.png'
import OrangeButton from '../styles/orangeButton';

const Login: React.FC = () => {
    const supabase = createClient();
    const [identifier, setIdentifier] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!identifier || !password) {
            setError("Please enter your email and password.");
            return;
        }
    
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier, 
            password: password,
        });

        if (!rememberMe) {
            window.addEventListener('beforeunload', () => {
              supabase.auth.signOut();
            });
        }
    
        if (error || !data || !data.user) {
            setError(error?.message || "Invalid credentials. Please try again.");
       
            return;
        }
    
        const user = data.user;
        console.log("userid:" + user.id)
    
        const { data: existingProfile, error: profileError } = await supabase
            .from("users")
            .select("id, username, email")
            .eq("id", user.id)
            .single();
        console.log(existingProfile)
        if (!existingProfile) {
            console.log("profile not existing")
            const { error: insertError } = await supabase
                .from("users")
                .insert([{ id: user.id, username: user.user_metadata.username, email: user.email }]);
    
            if (insertError) {
                console.error("Profile insertion error:", insertError);
                setError("Failed to insert profile.");    
                return;
            }
        }

        router.push("/dashboard");
    };

    const handleForgotPassword = async () => {
        if (!identifier) {
            alert("Enter your email to reset your password.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(identifier);
        if (error) {
            alert("Failed to send password reset email. Try again.");
        } else {
            alert("Password reset email sent!");
        }
    };
    
    return(
        <div className="flex flex-row bg-[#FDFCF9]">
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
                <h2 className="montserrat text-5xl font-bold">Welcome Back!</h2>
                <p className="my-4">Log in to connect, collaborate, and grow.</p>

                <img 
                    src={Blob.src}
                    className="absolute right-0 scale-75 -mr-12 mt-22"
                />


                <form onSubmit={handleSubmit} className="flex flex-col mt-6">
                    <input
                        type="email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Email Address"
                        className="w-96 px-4 py-2 mb-2 border-1 border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-96 px-4 py-2 mb-2 border-1 border-gray-300 rounded-lg mb-4"
                        required
                    />

                    {error && <p className="text-red-500">{error}</p>}


                    <OrangeButton type="submit" style={{ height: "3rem"}}>Log In</OrangeButton>

                    <div className="flex flex-row items-center mt-2 w-full">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="mr-2 h-4 w-4 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="rememberMe" className="text-sm">
                            Remember me
                        </label>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm right-0 cursor-pointer text-blue-700 ml-36"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    
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
                
                <p className="mt-4">Don't have an account yet??&nbsp; 
                    <Link href="/auth/register" className="text-blue-700">
                        Register
                    </Link>
                </p>
                
            </section>
            
        </div>
    );
};

export default Login;
