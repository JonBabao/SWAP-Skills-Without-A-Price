"use client";

import React, { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import Link from "next/link";

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

    return(
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
            />

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <button type="submit">
                Sign Up
            </button>
            <div>
                <p>Have an account already?&nbsp;</p>
                <Link href="/auth/login">
                    <button type="button">
                        Login
                    </button>
                </Link>
            </div>
        </form>
    );
};

export default Register;