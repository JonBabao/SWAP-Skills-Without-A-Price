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

const Home: React.FC = () => {
    const supabase = createClient();
    const [userData, setUserData] = useState();
    const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [progress, setProgress] = useState<any[]>([]); 
    const [mentors, setMentors] = useState<any[]>([]);

    const [activeTab, setActiveTab] = useState<'overview' | 'exchange' | 'portfolio' | 'reviews'>('overview');

    const [showAllHistory, setShowAllHistory] = useState(false);

    const handleOpenHistory = () => setShowAllHistory(true);
    const handleCloseHistory = () => setShowAllHistory(false);

    const [showAllMentors, setShowAllMentors] = useState(false);

    const openMentorModal = () => setShowAllMentors(true);
    const closeMentorModal = () => setShowAllMentors(false);



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

                const { data: mentorData, error } = await supabase
                    .from('mentors')
                    .select(`
                        last_session_date,
                        status,
                        rating,
                        skill:skill_id ( name ),
                        mentor:mentor_id ( username, avatar_url ),
                        user:user_id ( username )
                    `)
                    .eq('user_id', authId)
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
                    
                    
                    console.log(sessionData)
                    
                const { data: progressData, error: progressError } = await supabase
                    .from('progress')
                    .select(`
                        progress,
                        skill:skill_id ( name )
                    `)
                    .eq('user_id', authId);
            
                setUserData(user);
                setSkillsOffered(skills);
                setSessions(sessionData);
                setProgress(progressData);
                setMentors(mentorData);
                
            }
        };

        fetchUserData();
    }, []);

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
                <div className="flex flex-col">
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

                                    {mentors.map((mentor, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-3 items-center py-4 border-t border-gray-200"
                                        >
                                            {/* Instructor and Date */}
                                            <div className="flex items-center justify-center space-x-4">
                                            <img
                                                src={mentor.mentor?.avatar_url}
                                                alt="Instructor"
                                                className="h-10 w-10 rounded-full"
                                            />

                                            <div>
                                                <p className="text-black font-medium">{mentor.mentor?.username}</p>
                                                <p className="text-gray-500 text-sm">
                                                {new Date(mentor.last_session_date).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                                </p>
                                            </div>
                                            </div>

                                            {/* Skill */}
                                            <div className="text-center">
                                            <p className="text-black">{mentor.skill?.name}</p>
                                            </div>

                                            {/* Action */}
                                            <div className="text-center">
                                            <button className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs">
                                                Show Details
                                            </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </section>
                        <CalendarScheduler />
                    </div>
                    )}

                    {activeTab === 'exchange' && (
                    <div>
              
                        <h2 className="text-xl font-bold mb-4">Skill Exchange</h2>
       
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

                    {mentors.map((mentor, index) => (
                        <div
                        key={index}
                        className="grid grid-cols-3 items-center py-4 border-t border-gray-200"
                        >
                        <div className="flex items-center justify-center space-x-4">
                            <img
                            src={mentor.mentor?.avatar_url}
                            alt="Instructor"
                            className="h-10 w-10 rounded-full"
                            />
                            <div>
                            <p className="text-black font-medium">{mentor.mentor?.username}</p>
                            <p className="text-gray-500 text-sm">
                                {new Date(mentor.last_session_date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                })}
                            </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-black">{mentor.skill?.name}</p>
                        </div>

                        <div className="text-center">
                            <button className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs">
                            Show Details
                            </button>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            )}


        </div>
    );
}

export default Home;