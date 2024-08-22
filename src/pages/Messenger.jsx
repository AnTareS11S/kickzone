import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import Conversation from '../components/home/conversations/Conversation';
import Message from '../components/home/message/Message';
import { FiSearch, FiSend } from 'react-icons/fi';
const Messenger = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    fetchConversations();
  }, [currentUser._id]);

  useEffect(() => {
    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm) fetchUsers();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/conversations/${currentUser._id}`);
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      setError('Error fetching conversations. Please try again.');
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessages = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/messages/${currentChat._id}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      setError('Error fetching messages. Please try again.');
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/conversation/get-people?term=${searchTerm}`
      );
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      setError('Error searching users. Please try again.');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    // Create or fetch conversation logic here
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const message = {
      conversation: currentChat._id,
      sender: currentUser._id,
      text: newMessage,
    };

    try {
      setIsLoading(true);
      const res = await fetch('/api/messages/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (!res.ok) throw new Error('Failed to send message');
      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      setError('Error sending message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='container mx-auto p-4 max-w-7xl h-[calc(100vh-80px)]'
    >
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>Messages</h1>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-full'>
        <div className='lg:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden'>
          <Tabs defaultValue='conversations' className='h-full flex flex-col'>
            <TabsList className='mb-4 p-2 bg-gray-100'>
              <TabsTrigger value='conversations' className='flex-1'>
                Conversations
              </TabsTrigger>
              <TabsTrigger value='search' className='flex-1'>
                Search
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value='conversations'
              className='flex-grow overflow-y-auto p-4'
            >
              {isLoading ? (
                <div className='flex justify-center items-center h-full'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                </div>
              ) : error ? (
                <div className='text-red-500 text-center'>{error}</div>
              ) : (
                <AnimatePresence>
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setCurrentChat(conversation)}
                      className='mb-2'
                    >
                      <Conversation
                        conversation={conversation}
                        user={currentUser}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>
            <TabsContent
              value='search'
              className='flex-grow overflow-y-auto p-4'
            >
              <div className='relative mb-4'>
                <Input
                  type='text'
                  placeholder='Search users...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
                <FiSearch
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={18}
                />
              </div>
              {isLoading ? (
                <div className='flex justify-center items-center h-full'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                </div>
              ) : error ? (
                <div className='text-red-500 text-center'>{error}</div>
              ) : (
                <AnimatePresence>
                  {users.map((user) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className='flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 mb-2'
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={
                          user.imageUrl ||
                          'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                        }
                        alt={user.name}
                        className='mr-3 w-10 h-10 rounded-full object-cover'
                      />
                      <span className='font-medium text-gray-700'>
                        {user.name} {user.surname}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div className='lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col'>
          {currentChat ? (
            <>
              <div className='p-4 bg-gray-100 border-b'></div>
              <div className='flex-grow overflow-y-auto p-4'>
                {isLoading ? (
                  <div className='flex justify-center items-center h-full'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                  </div>
                ) : error ? (
                  <div className='text-red-500 text-center'>{error}</div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message._id}
                        ref={scrollRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Message
                          message={message}
                          own={message.sender === currentUser._id}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
              <div className='p-4 bg-gray-100'>
                <form
                  onSubmit={handleSendMessage}
                  className='flex items-center'
                >
                  <Input
                    type='text'
                    placeholder='Type a message...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='flex-grow mr-2'
                  />
                  <Button
                    type='submit'
                    className='bg-primary-500 hover:bg-primary-600 transition-colors duration-200'
                    disabled={isLoading || !newMessage.trim()}
                  >
                    <FiSend size={18} className='mr-2' />
                    Send
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='text-gray-500 text-lg'>
                Select a conversation or search for a user to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Messenger;
