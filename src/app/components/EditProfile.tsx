"use client";
import React, { useState, useEffect } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createClient } from '../../../lib/supabase/client';
import ProfilePlaceholder from '../../../public/images/profilePlaceholder.jpg'
import { useRouter } from 'next/navigation';

interface Skill {
  id: number;
  name: string;
  images: File[];
  previews: string[];
}

const supabase = createClient();

const EditProfile: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [birthDate, setBirthDate] = useState<Date | null>(new Date());
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [wantedSkills, setWantedSkills] = useState<string[]>([]);


    
    const router = useRouter()

    // Fetch user profile and skills on component mount
    useEffect(() => {
        const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user profile
        const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileData) {
            setProfile(profileData);
            setBirthDate(profileData.birth_date ? new Date(profileData.birth_date) : null);
            setWantedSkills(profileData.skills_wanted || []);
        
            // Fetch user's offered skills with images
        const { data: skillsData } = await supabase
            .from('user_skills_offered')
            .select('skill_id, skills(name), images')
            .eq('user_id', user.id);

        if (skillsData) {
            const formattedSkills = skillsData.map((item: any, index: number) => ({
                id: index + 1,
                name: item.skills.name,
                images: [],
                previews: item.images || []
            }));
            setSkills(formattedSkills.length ? formattedSkills : [{ id: 1, name: '', images: [], previews: [] }]);
            }
        }
        setLoading(false);
    };
        fetchProfile();
    }, []);

    const addSkillRow = () => {
        setSkills([...skills, { id: skills.length + 1, name: '', images: [], previews: [] }]);
    };

    const removeSkillRow = (id: number) => {
        if (skills.length > 1) {
            setSkills(skills.filter(skill => skill.id !== id));
        }
    };

    const handleSkillChange = (id: number, value: string) => {
        setSkills(skills.map(skill => 
        skill.id === id ? { ...skill, name: value } : skill
        ));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, skillId: number) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
      
            setSkills(skills.map(skill => {
                if (skill.id === skillId) {
                    return {
                    ...skill,
                    images: [...skill.images, ...files],
                    previews: [...skill.previews, ...newPreviews]
                    };
                }
                return skill;
            }));
        }
    };

    const removeImage = (skillId: number, imageIndex: number) => {
        setSkills(skills.map(skill => {
        if (skill.id === skillId) {
            const newImages = [...skill.images];
            const newPreviews = [...skill.previews];
            newImages.splice(imageIndex, 1);
            newPreviews.splice(imageIndex, 1);
            return { ...skill, images: newImages, previews: newPreviews };
        }
        return skill;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error(userError?.message || 'User not authenticated');

            // Upload new skill images and get URLs
            const updatedSkills = await Promise.all(
            skills.map(async (skill) => {
                if (skill.images.length > 0) {
                const uploadedUrls = await Promise.all(
                    skill.images.map(async (file) => {
                    const fileName = `${user.id}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
                    const { error } = await supabase.storage
                        .from('images')
                        .upload(`skill-pictures/${fileName}`, file, {
                        upsert: false,
                        contentType: file.type
                        });
                    if (error) throw error;
                    
                    const { data: { publicUrl } } = supabase.storage
                        .from('images')
                        .getPublicUrl(`skill-pictures/${fileName}`);
                    
                    return publicUrl;
                    })
                );

                const existingPermanentUrls = skill.previews.filter(
                    url => !url.startsWith('blob:')
                );
                return { ...skill, previews: [...existingPermanentUrls, ...uploadedUrls] };
                }
                return skill;
            })
            );

            // Prepare profile update data
            const skillsOffered = updatedSkills.map(skill => skill.name).filter(name => name);
            const profileUpdateData = {
            skills_offered: skillsOffered,
            skills_wanted: wantedSkills,
            // ... other profile fields
            };

            // Update user profile
            const { error: profileError } = await supabase
            .from('users')
            .update(profileUpdateData)
            .eq('id', user.id);
            if (profileError) throw profileError;

            // Process each skill - create if doesn't exist
            const skillsUpsert = await Promise.all(
            updatedSkills
                .filter(skill => skill.name)
                .map(async (skill) => {
                // Check if skill exists
                let skillId: number;
                const { data: existingSkill } = await supabase
                    .from('skills')
                    .select('id')
                    .eq('name', skill.name)
                    .single();

                if (existingSkill) {
                    skillId = existingSkill.id;
                } else {
                    // Create new skill if it doesn't exist
                    const { data: newSkill, error: insertError } = await supabase
                    .from('skills')
                    .insert({ name: skill.name })
                    .select()
                    .single();
                    
                    if (insertError) throw insertError;
                    skillId = newSkill.id;
                }

                return {
                    user_id: user.id,
                    skill_id: skillId,
                    images: skill.previews
                };
                })
            );

            // Upsert the user_skills_offered records
            const { error: upsertError } = await supabase
            .from('user_skills_offered')
            .upsert(skillsUpsert, {
                onConflict: 'user_id,skill_id'
            });
            if (upsertError) throw upsertError;
                alert('Profile updated successfully!');
                router.push('/dashboard')
            } catch (error) {
                console.error('Profile update failed:', error);
                alert(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                setSaving(false);
            }
        };

            const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) {
                return;
            }

            setSaving(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile?.id || 'unknown'}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `profile-pictures/${fileName}`;

            try {
                // First check if user is authenticated
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('No authenticated user');

                // Upload the file
                const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    upsert: true,
                    contentType: file.type
                });

                if (uploadError) throw uploadError;

                // Get the public URL
                const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

                // Update the user's avatar_url in the database
                const { error: updateError } = await supabase
                .from('users')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

                if (updateError) throw updateError;

                // Update local state
                setProfile({ ...profile, avatar_url: publicUrl });
                alert('Profile picture updated successfully!');
            } catch (error) {
                console.error('Error uploading avatar:', error);
                alert('Error uploading avatar. Please try again.');
            } finally {
                setSaving(false);
        }
    };

  

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto py-10 px-6">
            <h2 className="text-2xl font-semibold mb-6">My Profile &gt; Edit Profile</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left column */}
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <label className="cursor-pointer">
                            <img 
                            src={profile?.avatar_url || ProfilePlaceholder.src} 
                            className="rounded-full w-24 h-24 ml-8" 
                            alt="Profile" 
                            />
                            <p className="text-sm text-center mt-1">Click to upload new photo</p>
                            <input 
                            type="file" 
                            className="hidden" 
                            onChange={handleAvatarUpload}
                            accept="image/*"
                            />
                        </label>
                        </div>
                    
                    <div className="flex gap-7">
                        <input 
                        type="text" 
                        placeholder="First Name" 
                        className="w-full border p-2 rounded" 
                        value={profile?.first_name || ''}
                        onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                        />
                        <input 
                        type="text" 
                        placeholder="Last Name" 
                        className="w-full border p-2 rounded" 
                        value={profile?.last_name || ''}
                        onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full border p-2 rounded" 
                        value={profile?.email || ''}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                        <input 
                        type="tel" 
                        placeholder="Phone" 
                        className="w-full border p-2 rounded" 
                        value={profile?.phone || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                        <input 
                        type="text" 
                        placeholder="Address" 
                        className="w-full border p-2 rounded" 
                        value={profile?.location || ''}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        />
                        <input 
                        type="text" 
                        placeholder="Language" 
                        className="w-full border p-2 rounded" 
                        value={profile?.language || ''}
                        onChange={(e) => setProfile({...profile, language: e.target.value})}
                        />
                    </div>

                    {/* Date Picker */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Date of Birth</label>
                        <DatePicker
                        selected={birthDate}
                        onChange={setBirthDate}
                        className="w-full border p-2 rounded"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        maxDate={new Date()}
                        dateFormat="MMMM d, yyyy"
                        />
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                    <textarea 
                        placeholder="Bio" 
                        className="w-full border p-2 rounded"
                        value={profile?.bio || ''}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    ></textarea>

                    {/* Skills Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                            <th className="px-4 py-2 text-left">Skills</th>
                            <th className="px-4 py-2 text-left">Images</th>
                            <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {skills.map((skill) => (
                            <tr key={skill.id} className="border-t">
                                <td className="px-4 py-2">
                                <input
                                    type="text"
                                    value={skill.name}
                                    onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                                    placeholder="Enter skill"
                                    className="w-full p-2 border rounded"
                                />
                                </td>
                                <td className="px-4 py-2">
                                <div className="flex flex-wrap gap-2">
                                    {skill.previews.map((preview, idx) => (
                                    <div key={idx} className="relative">
                                        <img 
                                        src={preview} 
                                        alt={`Preview ${idx}`} 
                                        className="w-12 h-12 object-cover rounded"
                                        />
                                        <button
                                        type="button"
                                        onClick={() => removeImage(skill.id, idx)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                        <X size={12} />
                                        </button>
                                    </div>
                                    ))}
                                    <label className="cursor-pointer">
                                    <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                        <ImageIcon size={20} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, skill.id)}
                                        className="hidden"
                                    />
                                    </label>
                                </div>
                                </td>
                                <td className="px-4 py-2">
                                <button
                                    type="button"
                                    onClick={() => removeSkillRow(skill.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <X size={20} />
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        <div className="p-2 border-t">
                        <button
                            type="button"
                            onClick={addSkillRow}
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                        >
                            <Plus size={16} />
                            Add Skill
                        </button>
                        </div>
                    </div>

                    {/* Skills Wanted Section */}
                    <div className="border rounded-lg overflow-hidden mt-4">
                    <div className="p-4 bg-gray-50">
                        <h3 className="font-medium">Skills I Want to Learn</h3>
                        <p className="text-sm text-gray-500">Add skills you're interested in learning</p>
                    </div>
                    <div className="p-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                        {wantedSkills.map((skill, index) => (
                            <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <span>{skill}</span>
                            <button
                                type="button"
                                onClick={() => {
                                setWantedSkills(wantedSkills.filter((_, i) => i !== index));
                                }}
                                className="ml-2 text-gray-500 hover:text-red-500"
                            >
                                <X size={14} />
                            </button>
                            </div>
                        ))}
                        </div>
                        <div className="flex">
                        <input
                            type="text"
                            placeholder="Add a skill you want to learn"
                            className="flex-1 border p-2 rounded-l"
                            onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                e.preventDefault();
                                setWantedSkills([...wantedSkills, e.currentTarget.value.trim()]);
                                e.currentTarget.value = '';
                            }
                            }}
                        />
                        <button
                            type="button"
                            className="bg-[#FF7A59] hover:bg-orange-500 text-white ml-1 px-3 rounded-xl"
                            onClick={() => {
                            const input = document.querySelector('input[placeholder="Add a skill you want to learn"]') as HTMLInputElement;
                            if (input?.value.trim()) {
                                setWantedSkills([...wantedSkills, input.value.trim()]);
                                input.value = '';
                            }
                            }}
                        >
                            Add
                        </button>
                        </div>
                    </div>
                    </div>

                    <div className="flex gap-8">
                        <input 
                        type="text" 
                        placeholder="Twitter" 
                        className="w-full border p-2 rounded" 
                        value={profile?.social_links?.twitter || ''}
                        onChange={(e) => setProfile({
                            ...profile, 
                            social_links: {
                            ...profile?.social_links,
                            twitter: e.target.value
                            }
                        })}
                        />
                        <input 
                        type="text" 
                        placeholder="Linked In" 
                        className="w-full border p-2 rounded" 
                        value={profile?.social_links?.linkedin || ''}
                        onChange={(e) => setProfile({
                            ...profile, 
                            social_links: {
                            ...profile?.social_links,
                            linkedin: e.target.value
                            }
                        })}
                        />
                    </div>

                    <div className="flex gap-8">
                        <input 
                        type="text" 
                        placeholder="Facebook" 
                        className="w-full border p-2 rounded" 
                        value={profile?.social_links?.facebook || ''}
                        onChange={(e) => setProfile({
                            ...profile, 
                            social_links: {
                            ...profile?.social_links,
                            facebook: e.target.value
                            }
                        })}
                        />
                        <input 
                        type="text" 
                        placeholder="Instagram" 
                        className="w-full border p-2 rounded" 
                        value={profile?.social_links?.instagram || ''}
                        onChange={(e) => setProfile({
                            ...profile, 
                            social_links: {
                            ...profile?.social_links,
                            instagram: e.target.value
                            }
                        })}
                        />
                    </div>
                </div>

                <div className="col-span-2 flex justify-end mt-6">
                    <button 
                        type="submit"
                        className="bg-[#FF7A59] hover:bg-orange-500 text-white px-6 py-2 rounded-full flex items-center gap-2"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save & Update'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;