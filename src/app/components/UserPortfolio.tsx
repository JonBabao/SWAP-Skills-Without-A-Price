"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { ImageIcon } from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  images: string[];
}

const supabase = createClient();

const getImageUrl = (path: string) => {
  const cleanPath = path.replace(/^.*\/storage\/v1\/object\/public\/images\//, '');
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(cleanPath);
  return publicUrl;
};

const UserPortfolio = () => {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error('Not authenticated');

        // Fetch user data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        // Fetch skills with properly formatted image URLs
        const { data: skillsData } = await supabase
          .from('user_skills_offered')
          .select(`
            skill_id, 
            skills(name),
            images
          `)
          .eq('user_id', authUser.id);

        if (skillsData) {
          const formattedSkills = skillsData.map((item: any) => ({
            id: item.skill_id,
            name: item.skills.name,
            images: (item.images || []).map(getImageUrl)
          }));
          setSkills(formattedSkills);
        }

        setUser(userData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <img
            src={user?.avatar_url || "/default-avatar.jpg"}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            alt="Profile"
          />
          <h1 className="mt-4 text-3xl font-bold">
            {user?.username} 
          </h1>
          <p>{user?.bio}</p>
        </div>

        <div className="space-y-8">
          {skills.map(skill => (
            <div key={skill.id} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">{skill.name}</h2>
              
              <div className="flex flex-wrap gap-4">
                {skill.images.length > 0 ? (
                  skill.images.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`${skill.name} example ${idx + 1}`}
                        className="w-48 h-48 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Failed to load image:', url);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8 w-full">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No images for this skill
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Contact Info */}
        {user.email && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Information
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              {user.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {user.phone}
                </p>
              )}
              {user.location && (
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {user.location}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPortfolio;