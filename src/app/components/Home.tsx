"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '../../../lib/supabase/client'
import Image from '../../../public/images/logo.png'
import LocationIcon from '../../../public/images/locationIcon.png'
import FlagIcon from '../../../public/images/flagIcon.png'
import dashboardStars from '../../../public/images/dashboardStars.png'
import Facebook from '../../../public/images/facebookIcon.png'
import Instagram from '../../../public/images/instaIcon.png'
import XIcon from '../../../public/images/xIcon.png'
import LinkedIn from '../../../public/images/linkedInIcon.png'
import placeholder from '../../../public/images/placeholderCalendar.png'
import homeJoinButton from '../../../public/images/homeJoinButton.png'
import EditIcon from '../../../public/images/editIcon.png'
import SkillsPlaceholder from '../../../public/images/skillsPlaceholder.jpg'
import CalendarScheduler from './CalendarScheduler'
import { MessageCircle, Eye, SquareX, Check, X, ArrowDownUp } from 'lucide-react';

const Home: React.FC = () => {
    const supabase = createClient();
    const [userData, setUserData] = useState();
    const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [progress, setProgress] = useState<any[]>([]); 
    const [swaps, setSwaps] = useState<any[]>([]);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);

    const [activeTab, setActiveTab] = useState<'overview' | 'exchange' | 'portfolio' | 'reviews'>('overview');

    const [showAllHistory, setShowAllHistory] = useState(false);

    const handleOpenHistory = () => setShowAllHistory(true);
    const handleCloseHistory = () => setShowAllHistory(false);

    const [showAllMentors, setShowAllMentors] = useState(false);

    const openMentorModal = () => setShowAllMentors(true);
    const closeMentorModal = () => setShowAllMentors(false);

    const [showAllSwaps, setShowAllSwaps] = useState(false);

    const openAllSwaps = () => setShowAllSwaps(true);
    const closeAllSwaps = () => setShowAllSwaps(false);

    const [showAllCompletedSwaps, setShowAllCompletedSwaps] = useState(false);

    const openAllCompletedSwaps = () => setShowAllCompletedSwaps(true);

    const [showAllRequests, setShowAllRequests] = useState(false);

    const openAllRequests = () => setShowAllRequests(true);




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
               
                const { data: skills, error: skillsError } = await supabase
                    .from('user_skills_offered')
                    .select('skills (id, name, thumbnail_url)')
                    .eq('user_id', authId)

                const { data: swapData, error } = await supabase
                    .from('swaps')
                    .select(`
                        last_session_date,
                        status,
                        rating,
                        user_skill:user_skill ( name ),
                        mentor_skill:mentor_skill ( name ),
                        mentor:mentor_id ( username, email, id, avatar_url ),
                        user:user_id ( username, email, id, avatar_url ),
                        user_skill_progress,
                        mentor_skill_progress,
                        date_completed,
                        completed
                    `)
                    .or(`user_id.eq.${authId},mentor_id.eq.${authId}`)
                    .order('last_session_date', { ascending: false }); 

                const { data: sessionData } = await supabase
                    .from('sessions')
                    .select(`
                        date,
                        skill:skill_id ( name ),
                        user:user_id ( username ),
                        mentor:mentor_id ( username ),
                        status,
                        rating
                    `)
                    .or(`user_id.eq.${authId},mentor_id.eq.${authId}`)
                    .order('date', { ascending: false }); 
                    
                    
                const { data: progressData, error: progressError } = await supabase
                    .from('progress')
                    .select(`
                        progress,
                        skill:skill_id ( name )
                    `)
                    .eq('user_id', authId);

                const { data: scheduleData } = await supabase
                    .from('schedules')
                    .select('user_id, mentor_id, date_time')
                    .or(`user_id.eq.${authId},mentor_id.eq.${authId}`)
                    .order('date_time', { ascending: false }); 

                const { data: requestData } = await supabase
                    .from('requests')
                    .select(`
                        id,
                        user_id,
                        mentor_id,
                        user:user_id ( id, username, avatar_url ),
                        mentor:mentor_id ( id, username, avatar_url ),
                        user_skill ( name ),
                        mentor_skill ( name ),
                        date_time, 
                        message, 
                        status,
                        mode
                    `)
                    .eq('mentor_id', authId)
            
                setUserData(user);
                setSkillsOffered(skills);
                setSessions(sessionData);
                setProgress(progressData);
                setSwaps(swapData);
                setSchedules(scheduleData);
                setRequests(requestData);
                
            }
        };

        fetchUserData();
    }, []);

    const acceptPending = async (req: any) => {
        const titleName = `${req.user_skill?.name} and ${req.mentor_skill?.name}`;
        const { error: acceptError } = await supabase
            .from('schedules')
            .insert({
                title: titleName,
                user_id: req.user.id,
                mentor_id: req.mentor.id,
                date_time: req.date_time,
                mode: req.mode
            });

        if (acceptError) {
            console.error("Insert failed:", acceptError);
        } else {
            console.log("Schedule inserted successfully");
        }

        const { error: updateRequestsError } = await supabase
            .from('requests')
            .update({ status: true })
            .eq('id', req.id)

        if (updateRequestsError) {
            console.log("update request fail: ", updateRequestsError)
        }

        setRequests(prev => prev.filter(r =>
            !(
                r.user.id === req.user.id &&
                r.mentor.id === req.mentor.id &&
                r.date_time === req.date_time
            )
        ));

    };

    const declinePending = async (req: any) => {
        const { error: updateRequestsError } = await supabase
            .from('requests')
            .update({ status: true })
            .eq('id', req.id)

        if (updateRequestsError) {
            console.log("update request fail: ", updateRequestsError)
        }

        setRequests(prev => prev.filter(r =>
            !(
                r.user.id === req.user.id &&
                r.mentor.id === req.mentor.id &&
                r.date_time === req.date_time
            )
        ));
    }


    const editProfile = async () => {
        alert("Move to edit profile.")
    }

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({
            left: -300, // adjust the scroll amount as needed
            behavior: "smooth",
          });
        }
      };
    
      const scrollRight = () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({
            left: 300, // adjust the scroll amount as needed
            behavior: "smooth",
          });
        }
      };

    return(
        <div className="flex flex-row">
            {userData ? (
                <><div className="max-w-md mt-20 mx-auto bg-white border-[#CBD7DF] border-1 rounded-tr-2xl p-6 text-center">
                    {/* Avatar and Edit */}
                    <div className="relative w-full flex justify-center mb-4">

                        <img src={userData.avatar_url} className="rounded-full w-30 h-30" />
                        <button className="absolute bottom-0 right-35 bg-white p-1 rounded-full shadow cursor-pointer" onClick={editProfile}>
                            <img src={EditIcon.src} alt="Edit" className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Name and Username */}
                    <h2 className="text-xl font-bold">{userData.username}</h2>
                    <p className="text-gray-600">{userData.email}</p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-4 mt-2">
                        <img src={Facebook.src} alt="Facebook" className="w-5 h-5" />
                        <img src={Instagram.src} alt="Instagram" className="w-5 h-5" />
                        <img src={XIcon.src} alt="Email" className="w-5 h-5" />
                        <img src={LinkedIn.src} alt="LinkedIn" className="w-5 h-5" />
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-700 mt-4">
                        {userData.bio}
                    </p>

                    <hr className="my-4" />

                    {/* Location & Language */}
                    <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center gap-1">
                            <img src={LocationIcon.src} alt="Location" className="w-4 h-4" />
                            <span>Location</span>
                        </div>
                        <span className="font-semibold text-right">{userData.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                            <img src={FlagIcon.src} alt="Language" className="w-4 h-4" />
                            <span>Language</span>
                        </div>
                        <span className="font-semibold text-right">{userData.language}</span>
                    </div>

                    {/* Skills Offered */}
                    <h3 className="text-left font-semibold text-md mt-6 mb-2">Skills Offered</h3>

                    <div
                        ref={scrollContainerRef}
                        className="flex space-x-4 overflow-x-auto pb-2 scroll-smooth"
                        style={{ scrollbarWidth: 'none' }}
                    >
                    {skillsOffered.length > 0 ? (
                        skillsOffered.map((entry) => {
                        const skill = entry.skills;
                        const imageUrl = skill.thumbnail_url || SkillsPlaceholder.src;

                        return (
                            <div
                            key={skill.id}
                            className="flex flex-col items-center w-30 border rounded-xl pb-2 flex-shrink-0"
                            >
                            <img
                                src={imageUrl}
                                alt={skill.name}
                                className="w-full h-12 rounded-t-xl mb-1"
                            />
                            <div className="flex flex-1 items-center justify-center px-2">
                                <span className="text-xs font-semibold break-words text-center">
                                {skill.name}
                                </span>
                            </div>
                            </div>
                        );
                        })
                    ) : (
                        <p className="text-sm text-gray-500">No skills offered yet.</p>
                    )}
                    </div>

                    {/* Scroll Button */}
                    <div className="flex justify-between mt-2">
                        <button
                        onClick={scrollLeft}
                        className="text-sm text-blue-500 hover:underline"
                        >
                        ← Prev
                        </button>
                        <button
                        onClick={scrollRight}
                        className="text-sm text-blue-500 hover:underline"
                        >
                        Next →
                        </button>
                    </div>

                    {/* Skills Wanted */}
                    <h3 className="text-left font-semibold text-md mt-6 mb-2">Skills Wanted</h3>
                    <div className="bg-gray-50 rounded-xl p-4 text-left text-sm">
                        {userData.skills_wanted && userData.skills_wanted.length > 0 ? (
                            userData.skills_wanted.map((skill: string, index: number) => (
                            <p key={index}>{skill}</p>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No skills wanted listed.</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-grow">
                    <nav className="flex flex-row gap-16 bg-white px-4 pb-1 border-[#CBD7DF] border-1 rounded-xl mx-4 mt-20 mb-4">
                        <button
                            className={`ml-8 ${activeTab === 'overview' ? 'swapOrangeText font-bold border-b-4 pt-4 pb-3 border-orange-500 -mb-1' : 'mt-1'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`${activeTab === 'exchange' ? 'swapOrangeText font-bold border-b-4 pt-4 pb-3 border-orange-500 -mb-1' : 'mt-1'}`}
                            onClick={() => setActiveTab('exchange')}
                        >
                            Skill Exchange
                        </button>
                        <button
                            className={`${activeTab === 'portfolio' ? 'swapOrangeText font-bold border-b-4 pt-4 pb-3 border-orange-500 -mb-1' : 'mt-1'}`}
                            onClick={() => setActiveTab('portfolio')}
                        >
                            Portfolio
                        </button>
                        <button
                            className={`${activeTab === 'reviews' ? 'swapOrangeText font-bold border-b-4 pt-4 pb-3 border-orange-500 -mb-1' : 'mt-1'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                        </nav>

                    {activeTab === 'overview' && (
                    <div className="flex flex-row">
                        <section className="flex flex-col mx-4">

                            <div className="swapOrangeBg flex flex-row px-6 pt-4 pb-4 h-46 text-white rounded-xl overflow-hidden">
                                <div>
                                    <p className="mb-4">LEARN. SHARE. CONNECT.</p>
                                    <p className="text-white text-2xl font-semibold break-words">Build your skills bank — one swap at a time.</p>
                                    <button
                                        className="cursor-pointer text-xs flex flex-row items-center mt-4 px-4 py-3 rounded-full bg-[#171717]"
                                    >
                                        Join Now
                                        <div className="ml-2 h-4 w-4 flex-shrink-0">
                                            <img
                                                src={homeJoinButton.src}
                                                alt="Join Icon"
                                                className="h-full w-full object-contain" />
                                        </div>
                                    </button>
                                </div>
                                <img
                                    src={dashboardStars.src}
                                    alt="Stars"
                                    className="h-72 object-contain -mt-14" />
                            </div>

                            {/* Progress */}
                            <div className="flex space-x-4 mt-4">
                                {progress.map((item, index) => (
                                    <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-sm px-6 py-4 w-56 flex justify-between items-center"
                                    >
                                    <div className="flex items-center space-x-4">
                                        <div className="montserrat bg-red-100 swapOrangeText font-extrabold rounded-full h-12 w-12 flex items-center justify-center text-lg">
                                        {item.progress}%
                                        </div>
                                        <div>
                                        <p className="text-xs text-gray-500">Progress</p>
                                        <p className="text-sm font-semibold text-black">
                                            {item.skill?.name}
                                        </p>
                                        </div>
                                    </div>
                                    <div className="text-gray-700 text-xl">⋮</div>
                                    </div>
                                ))}
                            </div>

                            
                            <div className="flex flex-col">
                                <div className="flex justify-between">
                                    <p className="font-semibold my-2">Session History</p>
                                    <button onClick={handleOpenHistory} className="text-sm text-gray-500 hover:underline">See all</button>
                                </div>
                                

                                <div className="bg-white rounded-lg px-8 pb-8">
                                    <table className="min-w-full text-xs text-left text-gray-700">
                                        <thead>
                                            <tr className="text-center">
                                                <th className="px-4 py-2">Date</th>
                                                <th className="px-4 py-2">Skill</th>
                                                <th className="px-4 py-2">Learner</th>
                                                <th className="px-4 py-2">Mentor</th>
                                                <th className="px-4 py-2">Status</th>
                                                <th className="px-4 py-2">Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody className="px-8">
                                            {Array.isArray(sessions) && sessions.length > 0 ? (
                                                sessions.map((session, idx) => {
                                                const date = new Date(session.date).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                });

                                                const isYouMentor = session.mentor?.username === userData.username;
                                                const isCompleted = session.status; 
                                                const rating = session.rating; 

                                                return (
                                                    <tr key={idx} className="border-b border-gray-200 text-center">
                                                    <td className="px-4 py-2">{date}</td>
                                                    <td className="px-4 py-2">{session.skill?.name}</td>
                                                    <td className="px-4 py-2">{isYouMentor ? session.user?.username : "You"}</td>
                                                    <td className="px-4 py-2">{isYouMentor ? "You" : session.mentor?.username}</td>
                                                    <td className="px-4 py-2">
                                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${isCompleted ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                        {isCompleted ? "Completed" : "Cancelled"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-yellow-400">
                                                        {isCompleted ? "★ ".repeat(rating) + "☆".repeat(5 - rating) : "—"}
                                                    </td>
                                                    </tr>
                                                );
                                                })
                                            ) : (
                                                <tr>
                                                <td colSpan={6} className="text-center text-gray-400 py-4">No sessions found.</td>
                                                </tr>
                                            )}
                                            </tbody>        
                                    </table>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between">
                                    <p className="font-semibold my-2">Your Mentor</p>
                                    <button onClick={openMentorModal} className="text-sm text-gray-500 hover:underline">See all</button>
                                </div>
                                
                                <div className="bg-white rounded-xl p-6 text-xs text-left">
                                    <div className="grid grid-cols-3 text-black font-medium mb-4 text-center">
                                        <div>Instructor Name and Last Session</div>
                                        <div>Skill</div>
                                        <div>Actions</div>
                                    </div>

                                    

                                    {swaps.map((mentor, index) => {
                                        const isCurrentUserReceiver = mentor.user.id === userData.id;
                                        const displayedSkill = isCurrentUserReceiver
                                            ? mentor.user_skill?.name
                                            : mentor.mentor_skill?.name;
                                     
                                        const displayedPartner = isCurrentUserReceiver ? mentor.mentor : mentor.user;

                                        return (
                                            <div
                                                key={index}
                                                className="grid grid-cols-3 items-center py-4 border-t border-gray-200"
                                            >
                                                {/* Partner and Date */}
                                                <div className="flex items-center justify-center space-x-4">
                                                    <img
                                                        src={displayedPartner?.avatar_url}
                                                        alt="Partner"
                                                        className="h-10 w-10 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="text-black font-medium">
                                                            {displayedPartner?.username}
                                                        </p>
                                                        <p className="text-gray-500 text-sm">
                                                            {new Date(mentor.last_session_date).toLocaleDateString("en-US", {
                                                                month: "long",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Skill being received */}
                                                <div className="text-center">
                                                    <p className="text-black">{displayedSkill}</p>
                                                </div>

                                                {/* Action */}
                                                <div className="text-center">
                                                    <button className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs">
                                                        Show Details
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>

                        </section>
                        <CalendarScheduler />
                    </div>
                    )}

                    {activeTab === 'exchange' && (
                        <div className="flex text-black">
                            <div className="flex flex-col px-4 min-w-172">
                                {/* Active Swaps */}
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h2 className=" text-lg font-semibold mb-2"><span className="text-blue-700 text-2xl">•</span> Active Swaps</h2>
                                        <button onClick={openAllSwaps} className="text-gray-500 text-sm hover:underline">See all</button>
                                    </div>
                                    <div className="flex gap-4 flex-wrap">
                                        {swaps?.filter(swap => swap.status).length === 0 ? (
                                            <div className="text-center text-gray-500 mt-4">No active swaps yet.</div>
                                        ) : (
                                        swaps
                                            ?.filter(swap => swap.status)
                                            .slice(0, 3)
                                            .map((swap, idx) => {
                                            const isUser = swap.user.id === userData.id;
                                            const otherUser = isUser ? swap.mentor : swap.user;
                                            const offeredSkill = isUser ? swap.user_skill?.name : swap.mentor_skill?.name;
                                            const requestedSkill = isUser ? swap.mentor_skill?.name : swap.user_skill?.name;
                                            const avatar_url = otherUser.avatar_url;
                                            
                                            const nextSchedule = schedules
                                                ?.filter(
                                                    (s) => new Date(s.date_time).getTime() > new Date().getTime()
                                                )
                                                ?.sort((a, b) => new Date(a.date_time) - new Date(b.date_time))[0];

                                            return (
                                                <div key={idx} className="w-54 bg-white rounded-xl p-4 border border-[#FF7A59]">
                                                    <div className="flex gap-2">
                                                        <img src={avatar_url} className="w-10 h-10 rounded-full" />
                                                        <div>
                                                            <p className="text-base font-semibold">{otherUser?.username}</p>
                                                            <p className="break-words max-w-30 text-xs text-gray-500">@{otherUser?.email}</p>
                                                        </div>
                                                    </div>


                                                    <div className="mt-2 text-sm space-y-2">
                                                        <p><strong>Skill offered:</strong><br />{offeredSkill}</p>
                                                        <p><strong>Skill requested:</strong><br />{requestedSkill}</p>
                                                        <p><strong>Next session:</strong><br />
                                                            {nextSchedule
                                                                ? new Date(nextSchedule.date_time).toLocaleString("en-US", {
                                                                    month: "long",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    })
                                                                : "No upcoming session"}

                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col mt-4 gap-1">
                                                        <button className="flex text-sm items-center bg-[#FF7A59] text-white px-2 py-1 rounded-full cursor-pointer hover:bg-orange-500">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View details
                                                        </button>
                                                        <button className="flex text-sm items-center text-white bg-[#FF7A59] px-2 py-1 rounded-full cursor-pointer hover:bg-orange-500">
                                                            <MessageCircle className="w-4 h-4 mr-2" />
                                                            Message
                                                        </button>
                                                        <button className="flex text-sm items-center text-white bg-[#FF7A59] px-2 py-1 rounded-full cursor-pointer hover:bg-orange-500">
                                                            <SquareX className="w-4 h-4 mr-2" />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                    </div>
                                </div>

                                {/* Completed Swaps */}
                                <div className="mt-10">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold mb-2"><span className="text-green-700 text-2xl">•</span> Completed Swaps</h2>
                                        <button onClick={openAllCompletedSwaps} className="text-gray-500 text-sm hover:underline">See all</button>
                                    </div>
                                    <div className="space-y-4">
                                    {swaps?.filter(swap => swap.completed).length === 0 ? (
                                        <div className="text-center text-gray-500 mt-4">No completed swaps yet.</div>
                                    ) : (
                                        swaps
                                            ?.filter(swap => swap.completed)
                                            .map((swap, idx) => {
                                                const isCurrentUserMentor = swap.user.id === userData.id;
                                                const mentor = isCurrentUserMentor ? swap.mentor.username : swap.user.username;

                                                const leftSkill = isCurrentUserMentor ? swap.mentor_skill?.name : swap.user_skill?.name;
                                                const rightSkill = isCurrentUserMentor ? swap.user_skill?.name : swap.mentor_skill?.name;
                                                const avatar_url = isCurrentUserMentor ? swap.mentor.avatar_url : swap.user.avatar_url;
                                                const swapDate = new Date(swap.date_completed).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                });

                                                return (
                                                    <div key={idx} className="rounded-xl px-4 py-5 flex flex-col items-center justify-between text-sm bg-white border border-[#FF7A59]">
                                                        <div className="flex items-center w-full gap-4 justify-between">
                                                            <img src={avatar_url} className="h-10 w-10 rounded-full" />
                                                            <div className="flex flex-col">
                                                                <p className="font-bold">{mentor}</p>
                                                                <p className="text-xs">@{swap.mentor?.email}</p>
                                                            </div>
                                                            <div className="flex flex-col items-center font-bold flex-grow">
                                                                <p>{leftSkill}</p>
                                                                <ArrowDownUp />
                                                                <p>{rightSkill}</p>
                                                            </div>
                                                            
                                                            <p className="flex flex-grow justify-end">{swapDate}</p>
                                                        </div>
                                                        <div className="flex w-full items-center justify-between mt-2">
                                                            <div className="flex items-center gap-2">
                                                                <button className="text-sm border border-red-300 px-3 py-1 rounded-full bg-white">
                                                                    <span className="text-yellow-600 mr-2">★ ★ ★ ★ ☆</span>
                                                                    Review
                                                                </button>
                                                            </div>
                                                            <button className="text-xs bg-[#FF7A59] hover:bg-orange-600 rounded-full px-3 font-semibold cursor-pointer text-white h-8">
                                                                View Summary
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    )}
                                    </div>
                                </div>
                            </div>    

                            {/* Pending Requests */}
                            <div className="px-6 pb-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold mb-2"><span className="text-yellow-600 text-2xl">•</span> Pending Requests</h2>
                                    <a onClick={openAllRequests} className="text-gray-500 text-sm hover:underline">See all</a>
                                </div>
                                <div className="flex flex-col flex-wrap gap-4">
                                {requests?.filter(req => !req.status).slice(0, 3).length === 0 ? (
                                    <p className="text-gray-500 text-sm">No pending requests yet</p>
                                    ) : (
                                    requests
                                        .filter(req => !req.status)
                                        .slice(0, 3)
                                        .map((req, idx) => (
                                        <div key={idx} className="w-76 bg-white rounded-xl p-4 border border-[#FF7A59]">
                                            <div className="flex gap-2 items-center">
                                                <img src={req.user.avatar_url} className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <div className="text-sm font-semibold">{req.user?.username}</div>
                                                    <div className="text-xs text-gray-500 break-words">@{req.user?.username}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-2 text-sm space-y-2">
                                                <p><strong>Skill offered:</strong> {req.mentor_skill?.name}</p>
                                                <p><strong>Skill requested:</strong> {req.user_skill?.name}</p>
                                                <p><strong>Proposed Date:</strong><br />
                                                    {new Date(req.date_time).toLocaleString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    hour12: true,
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button onClick={() => acceptPending(req)} className="flex text-sm bg-[#FF7A59] hover:bg-orange-600 px-2 pr-4 py-1 items-center rounded-full text-white">
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Accept
                                                </button>
                                                <button onClick={() => declinePending(req)} className="flex text-sm bg-[#FF7A59] hover:bg-orange-600 px-2 pr-4 py-1 items-center rounded-full text-white">
                                                    <X className="w-4 h-4 mr-2" />
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                        ))
                                    )}


                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                    <div>
                   
                        <h2 className="text-xl font-bold mb-4">Portfolio</h2>
                        <p>This is the Portfolio tab.</p>
                    </div>
                    )}

                    {activeTab === 'reviews' && (
                    <div>
                   
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <p>This is the Reviews tab.</p>
                    </div>
                    )}


                    
                </div></>
            ) : (<p>Loading Page</p>)}   

            {showAllHistory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
                    <div className="bg-white w-full max-w-4xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">All Sessions</h2>
                        <button onClick={handleCloseHistory} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
                    </div>
                    <table className="min-w-full text-xs text-left text-gray-700">
                        <thead>
                        <tr className="text-center">
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Skill</th>
                            <th className="px-4 py-2">Learner</th>
                            <th className="px-4 py-2">Mentor</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Rating</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.map((session, idx) => {
                            const date = new Date(session.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            });

                            const isYouMentor = session.mentor?.username === userData.username;
                            const isCompleted = session.status;
                            const rating = session.rating;

                            return (
                            <tr key={idx} className="border-b border-gray-200 text-center">
                                <td className="px-4 py-2">{date}</td>
                                <td className="px-4 py-2">{session.skill?.name}</td>
                                <td className="px-4 py-2">{isYouMentor ? session.user?.username : "You"}</td>
                                <td className="px-4 py-2">{isYouMentor ? "You" : session.mentor?.username}</td>
                                <td className="px-4 py-2">
                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${isCompleted ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                    {isCompleted ? "Completed" : "Cancelled"}
                                </span>
                                </td>
                                <td className="px-4 py-2 text-yellow-400">
                                {isCompleted ? "★ ".repeat(rating) + "☆".repeat(5 - rating) : "—"}
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    </div>
                </div>
            )}

            {showAllMentors && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
                    <div className="bg-white w-full max-w-4xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">All Mentors</h2>
                        <button onClick={closeMentorModal} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
                    </div>
                    <div className="grid grid-cols-3 text-black font-medium mb-4 text-center">
                        <div>Instructor Name and Last Session</div>
                        <div>Skill</div>
                        <div>Actions</div>
                    </div>

                    {swaps.map((mentor, index) => {
                        const isCurrentUserReceiver = mentor.user.id === userData.id;
                        const displayedSkill = isCurrentUserReceiver
                            ? mentor.user_skill?.name
                            : mentor.mentor_skill?.name;
                        
                        const displayedPartner = isCurrentUserReceiver ? mentor.mentor : mentor.user;

                        return (
                            <div
                                key={index}
                                className="grid grid-cols-3 items-center py-4 border-t border-gray-200"
                            >
                                {/* Partner and Date */}
                                <div className="flex items-center justify-center space-x-4">
                                    <img
                                        src={displayedPartner?.avatar_url}
                                        alt="Partner"
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div>
                                        <p className="text-black font-medium">
                                            {displayedPartner?.username}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(mentor.last_session_date).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Skill being received */}
                                <div className="text-center">
                                    <p className="text-black">{displayedSkill}</p>
                                </div>

                                {/* Action */}
                                <div className="text-center">
                                    <button className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs">
                                        Show Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            )}

            {showAllSwaps && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
                    <div className="bg-white w-full max-w-4xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">All Swaps</h2>
                            <button onClick={() => setShowAllSwaps(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">
                            &times;
                            </button>
                        </div>

                        <div className="flex gap-3">
                            {swaps.map((swap, idx) => {
                                const isUser = swap.user.id === userData.id;
                                const otherUser = isUser ? swap.mentor : swap.user;
                                const offeredSkill = isUser ? swap.user_skill?.name : swap.mentor_skill?.name;
                                const requestedSkill = isUser ? swap.mentor_skill?.name : swap.user_skill?.name;
                                const avatar_url = otherUser.avatar_url;

                                const nextSchedule = schedules
                                    ?.filter(
                                        (s) => new Date(s.date_time).getTime() > new Date().getTime()
                                    )
                                    ?.sort((a, b) => new Date(a.date_time) - new Date(b.date_time))[0];

                                return (
                                    <div key={idx} className="w-54 bg-white rounded-xl p-4 border border-[#FF7A59]">
                                        <div className="flex gap-2">
                                            <img src={avatar_url} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="text-base font-semibold">{otherUser?.username}</p>
                                                <p className="break-words max-w-30 text-xs text-gray-500">@{otherUser?.email}</p>
                                            </div>
                                        </div>

                                        <div className="mt-2 text-sm space-y-2">
                                            <p><strong>Skill offered:</strong><br />{offeredSkill}</p>
                                            <p><strong>Skill requested:</strong><br />{requestedSkill}</p>
                                            <p><strong>Next session:</strong><br />
                                            {nextSchedule
                                                ? new Date(nextSchedule.date_time).toLocaleString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    })
                                                : "No upcoming session"}
                                            </p>
                                        </div>

                                        <div className="flex flex-col mt-4 gap-1">
                                            <button className="flex text-sm items-center bg-[#FF7A59] text-white px-2 py-1 rounded-full cursor-pointer hover:bg-orange-500">
                                                <Eye className="w-4 h-4 mr-2" />
                                                View details
                                            </button>
                                            <button className="flex text-sm items-center text-white bg-[#FF7A59] px-2 py-1 rounded-full cursor-pointer hover:bg-orange-500">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Message
                                            </button>
                                            <button className="flex text-sm items-center text-white bg-[#FF7A59] px-2 py-1 rounded-full cursor-pointer hover:bg-orange-500">
                                                <SquareX className="w-4 h-4 mr-2" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            {showAllCompletedSwaps && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
                    <div className="bg-white w-full max-w-4xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">All Swaps</h2>
                            <button onClick={() => setShowAllCompletedSwaps(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">
                            &times;
                            </button>
                        </div>

                        <div className="flex gap-3">
                            {swaps?.filter(swap => swap.completed).length === 0 ? (
                                <div className="text-center text-gray-500 mt-4">No completed swaps yet.</div>
                            ) : (
                                swaps
                                    ?.filter(swap => swap.completed)
                                    .map((swap, idx) => {
                                        const isCurrentUserMentor = swap.user.id === userData.id;
                                        const mentor = isCurrentUserMentor ? swap.mentor.username : swap.user.username;

                                        const leftSkill = isCurrentUserMentor ? swap.mentor_skill?.name : swap.user_skill?.name;
                                        const rightSkill = isCurrentUserMentor ? swap.user_skill?.name : swap.mentor_skill?.name;
                                        const avatar_url = isCurrentUserMentor ? swap.mentor.avatar_url : swap.user.avatar_url;
                                        const swapDate = new Date(swap.date_completed).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        });

                                        return (
                                            <div key={idx} className="rounded-xl w-full px-4 py-5 flex flex-col items-center justify-between text-sm bg-white border border-[#FF7A59]">
                                                <div className="flex items-center w-full gap-4 justify-between">
                                                    <img src={avatar_url} className="h-10 w-10 rounded-full" />
                                                    <div className="flex flex-col">
                                                        <p className="font-bold">{mentor}</p>
                                                        <p className="text-xs">@{swap.mentor?.email}</p>
                                                    </div>
                                                    <div className="flex flex-col items-center font-bold flex-grow">
                                                        <p>{leftSkill}</p>
                                                        <ArrowDownUp />
                                                        <p>{rightSkill}</p>
                                                    </div>
                                                    
                                                    <p className="flex flex-grow justify-end">{swapDate}</p>
                                                </div>
                                                <div className="flex w-full items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <button className="text-sm border border-red-300 px-3 py-1 rounded-full bg-white">
                                                            <span className="text-yellow-600 mr-2">★ ★ ★ ★ ☆</span>
                                                            Review
                                                        </button>
                                                    </div>
                                                    <button className="text-xs bg-[#FF7A59] hover:bg-orange-600 rounded-full px-3 font-semibold cursor-pointer text-white h-8">
                                                        View Summary
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showAllRequests && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
                    <div className="bg-white w-full max-w-4xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">All Pending Requests</h2>
                            <button onClick={() => setShowAllRequests(false)} className="text-gray-600 hover:text-gray-900 text-xl font-bold">
                            &times;
                            </button>
                        </div>

                        <div className="flex gap-3">
                            {requests?.filter(req => !req.status).slice(0, 3).length === 0 ? (
                                    <p className="text-gray-500 text-sm">No pending requests yet</p>
                                    ) : (
                                    requests
                                        .filter(req => !req.status)
                                        .slice(0, 3)
                                        .map((req, idx) => (
                                        <div key={idx} className="w-76 bg-white rounded-xl p-4 border border-[#FF7A59]">
                                            <div className="flex gap-2 items-center">
                                                <img src={req.user.avatar_url} className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <div className="text-sm font-semibold">{req.user?.username}</div>
                                                    <div className="text-xs text-gray-500 break-words">@{req.user?.username}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-2 text-sm space-y-2">
                                                <p><strong>Skill offered:</strong> {req.mentor_skill?.name}</p>
                                                <p><strong>Skill requested:</strong> {req.user_skill?.name}</p>
                                                <p><strong>Proposed Date:</strong><br />
                                                    {new Date(req.date_time).toLocaleString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    hour12: true,
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button onClick={() => acceptPending(req)} className="flex text-sm bg-[#FF7A59] hover:bg-orange-600 px-2 pr-4 py-1 items-center rounded-full text-white">
                                                    <Check className="w-4 h-4 mr-2" />
                                                    Accept
                                                </button>
                                                <button className="flex text-sm bg-[#FF7A59] hover:bg-orange-600 px-2 pr-4 py-1 items-center rounded-full text-white">
                                                    <X className="w-4 h-4 mr-2" />
                                                    Decline
                                                </button>
                                            </div>
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

export default Home;