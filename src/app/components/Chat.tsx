'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { Paperclip, SendHorizontal, SquarePen } from 'lucide-react';
import { timeAgo } from '../../../lib/utils/timeAgo';


interface User {
  id: string;
  username: string;
  avatar_url: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const Chat: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [contacts, setContacts] = useState<User[]>([]);
    const [selected, setSelected] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const bottomRef = useRef<HTMLDivElement | null>(null);


    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()
            .then(({ data }) => setUser(data));
        }
        });
    }, []);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView();
        }
    }, [messages, selected]);


    useEffect(() => {
        if (!user) return;
        supabase
        .rpc('get_chat_contacts', { current_user_id: user.id }) 
        .then(({ data }) => setContacts(data));
    }, [user]);

        useEffect(() => {
            if (!selected || !user) return;

            const fetchMessages = () => {
                supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selected.id}),and(sender_id.eq.${selected.id},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: true })
                .then(({ data }) => {
                    if (data) setMessages(data);
                });
            };

            fetchMessages(); 
            const interval = setInterval(fetchMessages, 3000); 

            return () => clearInterval(interval); 
        }, [selected]);

    const sendMessage = async () => {
        if (!newMessage || !user || !selected) return;
        const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selected.id,
        content: newMessage,
        });
        if (!error) {
        setMessages([...messages, {
            id: crypto.randomUUID(),
            sender_id: user.id,
            receiver_id: selected.id,
            content: newMessage,
            created_at: new Date().toISOString(),
        }]);
        setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <p className="text-center text-3xl font-bold py-4">Chat</p>
            <div className="flex">
                {/* Sidebar */}
                <div className="w-1/3 ml-10">
                    <div className="flex mb-4 items-center justify-between">
                        <h2 className="text-2xl font-bold">Inbox</h2>
                        <button
                            className="flex w-8 h-8 justify-center text-[#FBF8F2] items-center rounded-full bg-[#FF7A59] hover:bg-orange-500 cursor-pointer"
                            onClick={() => setShowNewMessageModal(true)}
                        >
                            <SquarePen className="w-5 h-5"/>
                        </button>
                    </div>
                    
                    <input type="text" placeholder="🔍 Search..." className="mb-4 px-5 py-3 bg-white rounded-full w-full focus:outline-none" />
                    <div className="overflow-y-auto h-127 bg-white rounded-lg">
                        {contacts.map((contact, index) => {
                        const isFirst = index === 0;
                        const isLast = index === contacts.length - 1;
                        const isSelected = selected?.id === contact.id;

                        return (
                            <div
                                key={contact.id}
                                onClick={() => setSelected(contact)}
                                className={`cursor-pointer p-3 flex items-center gap-3 hover:bg-orange-100 
                                    ${isSelected ? 'swapOrangeBg' : ''} 
                                    ${isFirst ? 'rounded-t-lg' : ''} 
                                    ${isLast ? 'rounded-b-lg' : ''}`}
                            >
                                <img src={contact.avatar_url} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className={`font-semibold ${isSelected ? 'text-[#FBF8F2]' : '' }`}>{contact.username}</p>
                                    <p className={`text-xs ${isSelected ? 'text-[#FBF8F2]' : '' }`}>Tap to open chat</p>
                                </div>
                            </div>
                        );
                        })}

                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col mx-8 h-154">
                    {selected ? (
                    <>
                        <div className="flex items-center gap-3 rounded-xl p-6 bg-white">
                            <img src={selected.avatar_url} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-bold">{selected.username}</p>
                                <p className="text-sm text-gray-500">Chatting now</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-2 mt-4 space-y-4 bg-white rounded-t-xl">
                            {messages.map((msg) => {
                                const isCurrentUser = msg.sender_id === user?.id;

                                return (
                                    <div key={msg.id} className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                        {!isCurrentUser && (
                                            <img src={selected?.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full" />
                                        )}

                                        <div className={`max-w-md ${isCurrentUser ? 'ml-auto text-right' : ''}`}>
                                            <p className={`inline-block p-2 min-w-8 text-center rounded-xl ${isCurrentUser ? 'swapOrangeBg text-white' : 'bg-gray-200 text-black'}`}>
                                                {msg.content}
                                            </p>

                                            {!isCurrentUser && (
                                                <p className="text-xs text-gray-400 mt-1">{timeAgo(msg.created_at)}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />

                        </div>
                        <div className="p-4 items-center flex gap-2 bg-white rounded-b-xl">
                            <button className="text-gray-500 cursor-pointer hover:bg-orange-500 hover:text-white p-2 rounded-full">
                                <Paperclip />
                            </button>
                            
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none"
                                placeholder="Write a message..."
                            />
                            <button onClick={sendMessage} className="bg-[#FF7A59] cursor-pointer hover:bg-orange-500 text-white px-4 py-2 rounded-lg">
                                <SendHorizontal />
                            </button>
                        </div>
                    </>
                    ) : (
                    <p className="flex-1 flex items-center justify-center text-gray-500">
                        Select a user to start chatting.
                    </p>
                    )}
                </div>
            </div>
            
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black/35 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                    <h3 className="text-lg font-bold mb-4">Start New Chat</h3>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none mb-4"
                        value={searchQuery}
                        onChange={async (e) => {
                        const value = e.target.value;
                        setSearchQuery(value);
                        if (value.length > 2) {
                            const { data } = await supabase
                            .from('users')
                            .select('*')
                            .ilike('username', `%${value}%`);
                            setSearchResults(data || []);
                        } else {
                            setSearchResults([]);
                        }
                        }}
                    />
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {searchResults.map((userResult) => (
                        <div
                            key={userResult.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer rounded"
                            onClick={() => {
                            setSelected(userResult);
                            setShowNewMessageModal(false);
                            setSearchQuery('');
                            setSearchResults([]);
                            }}
                        >
                            <img src={userResult.avatar_url} className="w-8 h-8 rounded-full" />
                            <span>{userResult.username}</span>
                        </div>
                        ))}
                        {searchQuery && searchResults.length === 0 && (
                        <p className="text-sm text-gray-400">No users found.</p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowNewMessageModal(false)}
                        className="ml-1 text-sm text-gray-500 hover:underline"
                    >
                        Cancel
                    </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
