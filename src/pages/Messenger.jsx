import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
import { FiSend } from 'react-icons/fi';
import { io } from 'socket.io-client';
import ChatUsers from '../components/home/chatUsers/ChatUsers';

const Messenger = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [accountId, setAccountId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [error, setError] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', accountId);
  }, [accountId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/conversations/${accountId}`);
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
    fetchConversations();
  }, [currentUser, accountId, isConversationOpen]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setIsLoading(true);
        if (!currentChat) return;
        const res = await fetch(`/api/messages/${currentChat?._id}`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getAccountId = async () => {
      try {
        const res = await fetch(`/api/user/get-account-id/${currentUser?._id}`);
        if (!res.ok) throw new Error('Failed to fetch account id');
        const data = await res.json();
        setAccountId(data);
      } catch (error) {
        console.error('Error fetching account id:', error);
      }
    };

    getAccountId();
  }, [currentUser._id]);

  useEffect(() => {
    if (currentChat) {
      const chatPartnerId = currentChat.members.find(
        (member) => member === accountId
      );

      const fetchChatPartner = async () => {
        try {
          const res = await fetch(
            `/api/user/get-user-info/${chatPartnerId}?conversationId=${currentChat?._id}`
          );
          if (!res.ok) throw new Error('Failed to fetch chat partner');
          const data = await res.json();
          setCurrentChatUser(data);
        } catch (error) {
          console.error('Error fetching chat partner:', error);
        }
      };
      fetchChatPartner();
    }
  }, [currentChat, accountId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const message = {
      conversation: currentChat._id,
      sender: accountId,
      text: newMessage,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== accountId
    );

    socket.current.emit('sendMessage', {
      senderId: accountId,
      receiverId,
      text: newMessage,
    });

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
      <h1 className='text-4xl font-extrabold mb-6 text-gray-800'>Messages</h1>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-full'>
        {/* Conversations List */}
        <div className='lg:col-span-1 bg-white rounded-lg shadow-xl overflow-hidden'>
          <Tabs defaultValue='conversations' className='h-full flex flex-col'>
            <TabsList className='mb-4 p-2 bg-gradient-to-r from-gray-100 to-gray-200'>
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
              <>
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    onClick={() => setCurrentChat(conversation)}
                    className='cursor-pointer transition transform hover:scale-105'
                  >
                    <Conversation conversation={conversation} />
                  </div>
                ))}
              </>
            </TabsContent>
            <TabsContent
              value='search'
              className='flex-grow overflow-y-auto p-4'
            >
              {error ? (
                <div className='text-red-500 text-center'>{error}</div>
              ) : (
                <ChatUsers
                  currentId={accountId}
                  setCurrentChat={setCurrentChat}
                  setIsConversationOpen={setIsConversationOpen}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Messages Section */}
        <div className='lg:col-span-2 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
          <div className='bg-primary-100 p-4 flex items-center border-b border-gray-200'>
            {currentChatUser && (
              <>
                <img
                  src={currentChatUser?.imageUrl}
                  alt='User'
                  className='w-12 h-12 rounded-full object-cover mr-4'
                />
                <div>
                  <h2 className='text-lg font-semibold text-gray-800'>
                    {currentChatUser?.name + ' ' + currentChatUser?.surname}
                  </h2>
                </div>
              </>
            )}
          </div>
          {currentChat ? (
            <>
              <div className='flex-grow overflow-y-auto p-4'>
                {error ? (
                  <div className='text-red-500 text-center'>{error}</div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div ref={scrollRef} key={message._id}>
                        <Message
                          message={message}
                          own={message.sender === accountId}
                        />
                      </div>
                    ))}
                  </>
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
                    className='flex-grow mr-2 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500'
                  />
                  <Button
                    type='submit'
                    className='bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-lg transition-colors duration-200 flex items-center'
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
