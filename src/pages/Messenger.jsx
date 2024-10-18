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
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import DeleteConversation from '../components/home/conversations/DeleteConversation';
import { MdOutlineClose } from 'react-icons/md';

const Messenger = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [accountId, setAccountId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isMessageLoaded, setIsMessageLoaded] = useState(false);
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);

  const [error, setError] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:3000');
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
        const res = await fetch(`/api/conversations/${accountId}`);
        if (!res.ok) throw new Error('Failed to fetch conversations');
        const data = await res.json();
        setConversations(data);
      } catch (error) {
        setError('Error fetching conversations. Please try again.');
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, [currentUser, accountId, isConversationOpen]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (!currentChat) {
          setIsMessageLoaded(false);
          return;
        }
        setIsMessageLoaded(true);
        const res = await fetch(`/api/messages/${currentChat?._id}`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsMessageLoaded(false);
      }
    };

    setMessages([]);
    getMessages();
  }, [currentChat]);

  useEffect(() => {
    const getAccountId = async () => {
      try {
        if (!currentUser?.isProfileFilled) return;
        const res = await fetch(`/api/user/get-account-id/${currentUser?._id}`);
        if (!res.ok) throw new Error('Failed to fetch account id');
        const data = await res.json();
        setAccountId(data);
      } catch (error) {
        console.error('Error fetching account id:', error);
      }
    };

    getAccountId();
  }, [currentUser]);

  useEffect(() => {
    const fetchChatPartner = async () => {
      try {
        if (!currentChat) return; // Don't fetch if there's no current chat

        const chatPartnerId = currentChat.members.find(
          (member) => member === accountId
        );
        if (!chatPartnerId) return;

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
    if (currentChat && accountId) {
      fetchChatPartner();
    } else {
      setCurrentChatUser(null);
    }
  }, [currentChat, accountId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    let conversation = currentChat;

    if (!conversation && selectedUser) {
      try {
        conversation = await getOrCreateConversation(selectedUser._id);
        setCurrentChat(conversation);
      } catch (error) {
        console.error('Error checking/creating conversation:', error);
        return;
      }
    }

    const receiverId =
      selectedUser?._id ||
      conversation.members.find((member) => member !== accountId);

    const message = {
      conversation: conversation._id,
      sender: accountId,
      receiver: receiverId,
      text: newMessage,
    };

    socket.current.emit('sendMessage', {
      conversationId: conversation._id,
      senderId: accountId,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await fetch('/api/messages/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (!res.ok) throw new Error('Failed to send message');
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    if (currentChat?._id !== conversation._id) {
      setCurrentChat(conversation);
      setSelectedUser(null);
      setMessages([]);
      setIsMessageLoaded(true);
      setActiveConversation(conversation._id);
    }
  };

  const handleSelectUser = async (user) => {
    if (selectedUser?._id !== user._id) {
      setSelectedUser(user);
      setMessages([]);
      setIsMessageLoaded(true);

      try {
        const conversation = await getOrCreateConversation(user._id);
        setCurrentChat(conversation);
        setActiveConversation(conversation._id);
      } catch (error) {
        console.error('Error checking for existing conversation:', error);
      } finally {
        setIsMessageLoaded(false);
      }
    }
  };

  const handleConversationDeleted = (deletedConversationId) => {
    setConversations((prevConversations) =>
      prevConversations.filter((conv) => conv._id !== deletedConversationId)
    );
    if (currentChat?._id === deletedConversationId) {
      setCurrentChat(null);
      setCurrentChatUser(null);
      setSelectedUser(null);
      setMessages([]);
    }
  };

  const getOrCreateConversation = async (userId) => {
    try {
      const res = await fetch(`/api/conversations/find/${accountId}/${userId}`);
      if (res.ok) {
        const existingConversation = await res.json();
        if (existingConversation) {
          return existingConversation;
        }
      }
      // If no existing conversation, create a new one
      const createRes = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: accountId,
          receiverId: userId,
        }),
      });
      if (!createRes.ok) throw new Error('Failed to create conversation');
      const newConversation = await createRes.json();
      setConversations((prev) => [...prev, newConversation]);
      return newConversation;
    } catch (error) {
      console.error('Error checking/creating conversation:', error);
      return null;
    }
  };

  if (!currentUser?.isProfileFilled) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='container mx-auto p-4 max-w-7xl h-[calc(100vh-80px)] flex flex-col items-center justify-center'
      >
        <div className='bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full'>
          <h2 className='text-2xl font-bold mb-4 text-gray-800'>
            Profile Incomplete
          </h2>
          <p className='text-gray-600 mb-6'>
            To start chatting, you need to complete your profile information
            first.
          </p>
          <Link
            to='/user/profile'
            className='bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors duration-200'
          >
            Complete Profile
          </Link>
        </div>
      </motion.div>
    );
  }

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
                    onClick={() => handleSelectConversation(conversation)}
                    className='cursor-pointer transition transform hover:scale-105'
                  >
                    <Conversation
                      conversation={conversation}
                      isActive={conversation._id === activeConversation}
                    />
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
                  onSelectUser={handleSelectUser}
                  setIsConversationOpen={setIsConversationOpen}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Messages Section */}
        <div className='lg:col-span-2 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col'>
          <div className='flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm'>
            {(selectedUser || currentChatUser) && (
              <>
                <div className='flex items-center space-x-4'>
                  <img
                    src={
                      (selectedUser || currentChatUser)?.imageUrl ||
                      'https://d3awt09vrts30h.cloudfront.net/blank-profile-picture.webp'
                    }
                    alt={(selectedUser || currentChatUser)?.name}
                    className='w-10 h-10 rounded-full object-cover ring-2 ring-gray-100'
                  />
                  <div className='flex flex-col'>
                    <h2 className='text-base font-medium text-gray-900'>
                      {`${(selectedUser || currentChatUser)?.name} ${
                        (selectedUser || currentChatUser)?.surname
                      }`}
                    </h2>
                  </div>
                </div>

                <div className='flex items-center space-x-3'>
                  {currentChat && (
                    <>
                      <DeleteConversation
                        conversation={currentChat}
                        onConversationDeleted={handleConversationDeleted}
                      />
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                          setCurrentChat(null);
                          setActiveConversation(null);
                        }}
                        className='bg-gray-0 text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors duration-200'
                      >
                        <MdOutlineClose className='w-5 h-5' />
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {currentChat || selectedUser ? (
            <>
              {!isMessageLoaded ? (
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
                    {!currentUser.isProfileFilled ? (
                      <div className='text-yellow-600 bg-yellow-100 p-3 rounded-lg'>
                        Please complete your profile before sending messages.
                      </div>
                    ) : (
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
                          disabled={!newMessage.trim()}
                        >
                          <FiSend size={18} className='mr-2' />
                          Send
                        </Button>
                      </form>
                    )}
                  </div>
                </>
              ) : (
                <Spinner />
              )}
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
