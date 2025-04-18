"use client";

import React, { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const Login: React.FC = () => {
    const supabase = createClient();
    const [identifier, setIdentifier] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
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
    
        if (error || !data || !data.user) {
            setError(error?.message || "Invalid credentials. Please try again.");
       
            return;
        }
    
        const user = data.user;
    
        const { data: existingProfile, error: profileError } = await supabase
            .from("profiles")
            .select("id, username, email")
            .eq("id", user.id)
            .single();
    
        if (!existingProfile) {
            const { error: insertError } = await supabase
                .from("profiles")
                .insert([{ id: user.id, username: user.user_metadata.username, email: user.email }]);
    
            if (insertError) {
                console.error("Profile insertion error:", insertError);
                setError("Failed to insert profile.");    
                return;
            }
        }

        router.push("/");
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
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button
                    type="button"
                    onClick={handleForgotPassword}
                >
                    Forgot Password?
                </button>
                <button type="submit">
                    Submit
                </button>

                <div>
                    <p>Not a member?&nbsp;</p>
                    <Link href="/auth/register">
                        <button type="button">
                            Register now
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
