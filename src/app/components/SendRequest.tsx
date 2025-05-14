"use client";

import React, { useState, useEffect } from "react";
import Logo from ".././../../public/images/logoBig.png";
import { createClient } from '../../../lib/supabase/client'
import { MessageCircle, Bell, X } from 'lucide-react';
import Link from 'next/link';
import SkillsPlaceHolder from '../../../public/images/skillsPlaceholder.jpg'

const SendRequest: React.FC = () => {
    const supabase = createClient();

    const [userData, setUserData] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
    const [selectedUserSkillsOffered, setSelectedUserSkillsOffered] = useState<any[]>([]);
    
    // Form state
    const [formData, setFormData] = useState({
        userSkill: '',
        mentorSkill: '',
        date: '',
        time: '',
        message: '',
        mode: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: auth, error: authError } = await supabase.auth.getUser();

            if (authError || !auth.user) {
                alert("User not logged in. Please log in.");
            } else {
                const authId = auth.user.id;
                const { data: user, error: userError } = await supabase
                    .from('users')
                    .select("*")
                    .eq('id', authId)
                    .single();

                setUserData(user);

                const { data: skills, error: skillsError } = await supabase
                    .from('user_skills_offered')
                    .select('skills (id, name, thumbnail_url)')
                    .eq('user_id', authId)

                setSkillsOffered(skills);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .ilike('username', `%${searchTerm}%`); 

                if (!error) {
                    setSearchResults(data);
                } else {
                    console.error("Search error:", error);
                }
            } else {
                setSearchResults([]);
            }
        }, 300); 

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        const fetchSelectedUserSkills = async () => {
            if (selectedUser?.id) {
                const { data: selectedUserSkills, error } = await supabase
                    .from('user_skills_offered')
                    .select('skills (id, name, thumbnail_url)')
                    .eq('user_id', selectedUser.id);
                
                if (!error) {
                    setSelectedUserSkillsOffered(selectedUserSkills);
                    // Reset form when user changes
                    setFormData({
                        userSkill: '',
                        mentorSkill: '',
                        date: '',
                        time: '',
                        message: '',
                        mode: ''
                    });
                } else {
                    console.error("Error fetching skills:", error);
                }
            }
        };

        fetchSelectedUserSkills();
    }, [selectedUser]); 

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userData || !selectedUser) {
            setSubmitError('Please select a user to send request to');
            return;
        }

        if (!formData.userSkill || !formData.mentorSkill || !formData.date || !formData.time) {
            setSubmitError('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Combine date and time
            const dateTimeString = `${formData.date}T${formData.time}`;
            const date = new Date(dateTimeString);
            
            // Format as ISO string with timezone (this will include timezone offset)
            const dateTimeWithTz = date.toISOString();

            const { data: userSkillId } = await supabase
                .from('skills')
                .select('id')
                .eq('name', formData.userSkill)
                .single()

            const { data: mentorSkillId } = await supabase
                .from('skills')
                .select('id')
                .eq('name', formData.mentorSkill)
                .single()

            const { data, error } = await supabase
                .from('requests')
                .insert([{
                    user_id: userData.id,
                    mentor_id: selectedUser.id,
                    user_skill: userSkillId.id,
                    mentor_skill: mentorSkillId.id,
                    date_time: dateTimeWithTz,
                    message: formData.message,
                    mode: formData.mode
                }]);

            if (error) {
                throw error;
            }

            setSubmitSuccess(true);
            setFormData({
                userSkill: '',
                mentorSkill: '',
                date: '',
                time: '',
                message: '',
                mode: ''
            });
            
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            console.error('Error submitting request:', error);
            console.log("UserDataId: ", userData.id, "MentorDataId: ", selectedUser.id)
  
            setSubmitError('Failed to send request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [showSkillsModal, setShowSkillsModal] = useState(false);
    const [modalContent, setModalContent] = useState<{
        title: string;
        skills: any[];
        type: 'offered' | 'wanted';
    } | null>(null);

    // ... (keep all your existing useEffect hooks the same)

    const openSkillsModal = (type: 'offered' | 'wanted') => {
        if (type === 'offered') {
            setModalContent({
                title: 'All Skills Offered',
                skills: selectedUserSkillsOffered,
                type: 'offered'
            });
        } else {
            setModalContent({
                title: 'All Skills Wanted',
                skills: selectedUser.skills_wanted || [],
                type: 'wanted'
            });
        }
        setShowSkillsModal(true);
    };


    return (
        <div className="flex md:flex-row p-6 bg-[#FFFCF8] rounded-lg w-full mt-22 max-w-6xl mx-auto gap-6">
            <div className="p-6 bg-white rounded-lg shadow w-96 mx-auto mb-6">
                <h2 className="text-xl font-bold mb-4">Search for a user</h2>
                <input
                    type="text"
                    placeholder="Type to search users"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-gray-200 focus:outline-none px-4 py-2 rounded w-full"
                />

                {/* Live Search Results */}
                {searchResults.length > 0 && (
                    <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto pt-2" style={{ scrollbarWidth: 'none' }}>
                        {searchResults.map((user: any) => (
                            <li
                                key={user.id}
                                onClick={() => {
                                    setSelectedUser(user);
                                    setSearchTerm(""); 
                                    setSearchResults([]); 
                                }}
                                className="cursor-pointer hover:bg-gray-100 px-4 py-2 rounded"
                            >
                                <div className="flex gap-2 items-center">
                                    <img src={user.avatar_url} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="text-base font-semibold">{user.username}</p>
                                        <p className="break-words max-w-30 text-xs text-gray-500">@{user.email}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        
            {/* Left Panel */}
            <div className="w-full md:w-1/2 space-y-6">
                {selectedUser ? (
                    <>
                        {/* Profile */}
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={selectedUser.avatar_url || "https://via.placeholder.com/100"}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full"
                            />
                            <h2 className="text-xl font-semibold mt-2">{selectedUser.username}</h2>
                            <p className="text-sm text-gray-500">{selectedUser.email}</p>
                            <p className="text-red-500 text-sm mt-1">★ 4.7 Ratings</p>
                        </div>

                      

                        <div className="flex justify-between items-center">
                            <h3 className="text-left font-semibold text-md">Skills Offered</h3>
                            {selectedUserSkillsOffered && (
                                <button 
                                    onClick={() => openSkillsModal('offered')}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    See All
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 overflow-x-auto pb-2 scroll-smooth">
                            {selectedUserSkillsOffered.length > 0 ? (
                                selectedUserSkillsOffered
                                .slice(0,3)
                                .map((entry) => {
                                    const skill = entry.skills;
                                    const imageUrl = skill.thumbnail_url || SkillsPlaceHolder.src;

                                    return (
                                        <div key={skill.id} className="flex items-center rounded-xl text-sm flex-shrink-0">
                                            <img
                                                src={imageUrl}
                                                alt={skill.name}
                                                className="w-12 h-12 object-cover rounded-lg mr-4"
                                            />
                                            {skill.name}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500">No skills offered yet.</p>
                            )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <h3 className="text-left font-semibold text-md">Skills Wanted</h3>
                            {selectedUser.skills_wanted && (
                                <button 
                                    onClick={() => openSkillsModal('wanted')}
                                    className="text-sm text-gray-500 hover:underline"
                                >
                                    See All
                                </button>
                            )}
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-left text-sm">
                            {selectedUser.skills_wanted && selectedUser.skills_wanted.length > 0 ? (
                                selectedUser.skills_wanted.slice(0, 3).map((skill: string, index: number) => (
                                    <p key={index}>{skill}</p>
                                ))
                            ) : (
                                <p className="text-gray-400 italic">No skills wanted listed.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-sm text-center">Select a user to see their profile.</p>
                )}
            </div>

            {/* Right Panel - Form */}
            <div className="w-full md:w-1/2 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* You offer */}
                    <div>
                        <label className="block text-sm font-medium mb-1">You offer</label>
                        <select 
                            name="userSkill"
                            value={formData.userSkill}
                            onChange={handleInputChange}
                            className="w-full border rounded px-4 py-2" 
                            required
                        >
                            <option disabled value="">Select from the skills you offer</option>
                            {skillsOffered.map((entry, index: number) => (
                                <option key={index} value={entry.skills.name}>
                                    {entry.skills.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* You want to learn */}
                    <div>
                        <label className="block text-sm font-medium mb-1">You want to learn</label>
                        <select 
                            name="mentorSkill"
                            value={formData.mentorSkill}
                            onChange={handleInputChange}
                            className="w-full border rounded px-4 py-2"
                            required
                        >
                            <option disabled value="">Select from the skills they offer</option>
                            {selectedUserSkillsOffered.map((entry, index: number) => {
                                const skill = entry.skills;
                                return (
                                    <option key={index} value={skill.name}>{skill.name}</option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Schedule */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Proposed schedule</label>
                        <div className="flex gap-2">
                            <input 
                                type="date" 
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-1/2 border rounded px-4 py-2" 
                                required
                            />
                            <input 
                                type="time" 
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-1/2 border rounded px-4 py-2" 
                                required
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Message (optional)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Send note to discuss the swap details"
                            className="w-full border rounded px-4 py-2 h-24"
                        />
                    </div>

                    {/* Mode */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Mode (optional)</label>
                        <input
                            type="text"
                            name="mode"
                            value={formData.mode}
                            onChange={handleInputChange}
                            placeholder="e.g. Online, In-person, etc."
                            className="w-full border rounded px-4 py-2"
                        />
                    </div>

                    {/* Status messages */}
                    {submitError && (
                        <div className="text-red-500 text-sm mt-2">{submitError}</div>
                    )}
                    {submitSuccess && (
                        <div className="text-green-500 text-sm mt-2">
                            Request sent successfully!
                        </div>
                    )}

                    {/* Send Request Button */}
                    <div className="text-center mt-4">
                        <button 
                            type="submit"
                            className="bg-[#FF7A59] hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Request'}
                        </button>
                    </div>
                </form>
            </div>
            {showSkillsModal && modalContent && (
                <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{modalContent.title}</h3>
                            <button 
                                onClick={() => setShowSkillsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {modalContent.type === 'offered' ? (
                                modalContent.skills.map((entry) => {
                                    const skill = entry.skills;
                                    const imageUrl = skill.thumbnail_url || SkillsPlaceHolder.src;
                                    return (
                                        <div key={skill.id} className="flex items-center gap-4 p-2 border-b">
                                            <img
                                                src={imageUrl}
                                                alt={skill.name}
                                                className="w-10 h-10 object-cover rounded-lg"
                                            />
                                            <span>{skill.name}</span>
                                        </div>
                                    );
                                })
                            ) : (
                                modalContent.skills.map((skill: string, index: number) => (
                                    <div key={index} className="p-2 border-b">
                                        {skill}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SendRequest;