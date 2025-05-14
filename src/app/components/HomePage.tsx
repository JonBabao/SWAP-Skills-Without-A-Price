"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import Link from 'next/link';
import ProfilePlaceHolder from '../../../public/images/profilePlaceholder.jpg'
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  location: string;
  language: string;
  skills_offered: string[];
  skills_wanted: string[];
  avatar_url: string;
}

const supabase = createClient();

const HomePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            id,
            username,
            location,
            language,
            skills_offered,
            skills_wanted,
            avatar_url
          `)
          .neq('username', null) 
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

const filteredUsers = users.filter(user => {
  const searchTermLower = searchTerm.toLowerCase();
  
  return (
    (user.username && user.username.toLowerCase().includes(searchTermLower)) ||
    (user.location && user.location.toLowerCase().includes(searchTermLower)) ||
    (user.language && user.language.toLowerCase().includes(searchTermLower)) ||
    (user.skills_offered && user.skills_offered.some(skill => 
      skill && skill.toLowerCase().includes(searchTermLower)
    )) ||
    (user.skills_wanted && user.skills_wanted.some(skill => 
      skill && skill.toLowerCase().includes(searchTermLower)
    ))
  );
});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Community Members</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name, location, skills..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {filteredUsers.map((user) => (
              <div 
                key={user.id}
                onClick={() => router.push(`/portfolio/${user.id}`)}
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={user.avatar_url || ProfilePlaceHolder.src}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
                      <p className="text-gray-600">{user.location}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Language</h3>
                      <p className="text-gray-800">{user.language || 'Not specified'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Skills Offered</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.skills_offered?.length > 0 ? (
                          user.skills_offered.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No skills listed</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Skills Wanted</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {user.skills_wanted?.length > 0 ? (
                          user.skills_wanted.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No skills listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700">
              {searchTerm ? 'No matching users found' : 'No users available'}
            </h2>
            <p className="mt-2 text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Check back later for new members'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;