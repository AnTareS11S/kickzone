import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../components/ui/use-toast';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { Avatar } from '../components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  // Mock function to fetch conversations (replace with actual API call)
  const fetchConversations = async () => {
    // Simulating API call
    return [
      {
        id: 1,
        user: {
          id: 1,
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        lastMessage: 'Hey there!',
        timestamp: '2023-07-07T10:30:00Z',
      },
      {
        id: 2,
        user: {
          id: 2,
          name: 'Jane Smith',
          avatar: 'https://i.pravatar.cc/150?img=2',
        },
        lastMessage: 'See you tomorrow!',
        timestamp: '2023-07-06T15:45:00Z',
      },
    ];
  };

  // Mock function to fetch users (replace with actual API call)
  const fetchUsers = async (term) => {
    // Simulating API call
    const mockUsers = [
      { id: 3, name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: 4, name: 'Alice Brown', avatar: 'https://i.pravatar.cc/150?img=4' },
    ];
    return mockUsers.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Mock function to fetch messages (replace with actual API call)
  const fetchMessages = async (userId) => {
    // Simulating API call
    return [
      {
        id: 1,
        sender: userId,
        text: 'Hey there!',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        sender: 'currentUser',
        text: 'Hi! How are you?',
        timestamp: new Date().toISOString(),
      },
    ];
  };

  useEffect(() => {
    fetchConversations().then(setConversations);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchUsers(searchTerm).then(setUsers);
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    const fetchedMessages = await fetchMessages(user.id);
    setMessages(fetchedMessages);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'currentUser',
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully.',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='container mx-auto p-4'
    >
      <h1 className='text-3xl font-bold mb-6'>Messages</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1'>
          <Tabs defaultValue='conversations'>
            <TabsList className='mb-4'>
              <TabsTrigger value='conversations'>Conversations</TabsTrigger>
              <TabsTrigger value='search'>Search</TabsTrigger>
            </TabsList>
            <TabsContent value='conversations'>
              <div className='space-y-2'>
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100'
                    onClick={() => handleUserSelect(conversation.user)}
                  >
                    <Avatar
                      src={conversation.user.avatar}
                      alt={conversation.user.name}
                      className='mr-2'
                    />
                    <div>
                      <div className='font-semibold'>
                        {conversation.user.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {conversation.lastMessage}
                      </div>
                    </div>
                    <div className='ml-auto text-xs text-gray-400'>
                      {new Date(conversation.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value='search'>
              <Input
                type='text'
                placeholder='Search users...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='mb-4'
              />
              <div className='space-y-2'>
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100'
                    onClick={() => handleUserSelect(user)}
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      className='mr-2'
                    />
                    <span>{user.name}</span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className='md:col-span-2'>
          {selectedUser ? (
            <>
              <div className='bg-white rounded-lg shadow p-4 mb-4'>
                <h2 className='text-xl font-semibold mb-2'>
                  Chat with {selectedUser.name}
                </h2>
                <Separator className='my-2' />
                <div className='h-96 overflow-y-auto mb-4'>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-2 ${
                        message.sender === 'currentUser'
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      <span
                        className={`inline-block p-2 rounded-lg ${
                          message.sender === 'currentUser'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200'
                        }`}
                      >
                        {message.text}
                      </span>
                      <div className='text-xs text-gray-500 mt-1'>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='flex'>
                  <Input
                    type='text'
                    placeholder='Type a message...'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className='flex-grow mr-2'
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p className='text-gray-500'>
                Select a conversation or search for a user to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Messages;
