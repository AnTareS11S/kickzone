import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { FaClock, FaFilter, FaThumbsUp } from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';
import { PinTopIcon } from '@radix-ui/react-icons';
import { BiMessageSquare } from 'react-icons/bi';
import PageHeader from '../../components/PageHeader';

const TeamForum = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Example data - replace with real data from your backend
  const categories = [
    { id: 'all', name: 'All Topics', count: 45 },
    { id: 'announcements', name: 'Announcements', count: 12 },
    { id: 'tactics', name: 'Tactics & Strategy', count: 15 },
    { id: 'training', name: 'Training', count: 8 },
    { id: 'social', name: 'Team Social', count: 10 },
  ];

  const posts = [
    {
      id: 1,
      title: 'Next Match Preparation - Tactics Discussion',
      author: {
        name: 'Coach Smith',
        avatar: '/api/placeholder/32/32',
      },
      isPinned: true,
      category: 'tactics',
      replies: 23,
      likes: 15,
      lastActivity: '2h ago',
      preview: "Let's discuss our approach for the upcoming match against...",
    },
    {
      id: 2,
      title: 'Team Building Event This Weekend',
      author: {
        name: 'Team Captain',
        avatar: '/api/placeholder/32/32',
      },
      isPinned: false,
      category: 'social',
      replies: 45,
      likes: 32,
      lastActivity: '5h ago',
      preview: "Don't forget about our team building event this Saturday...",
    },
  ];

  return (
    <div className='max-w-8xl mx-auto p-6'>
      {/* Header */}
      <PageHeader
        title='Team Forum'
        description='Connect, discuss, and stay updated with your team'
      />

      <Button className='bg-blue-600 hover:bg-blue-700'>New Thread</Button>

      {/* Search */}
      <div className='mb-6'>
        <div className='flex gap-4'>
          <Input placeholder='Search discussions...' className='max-w-md' />
          <Button variant='outline' className='gap-2'>
            <FaFilter className='h-4 w-4' />
            Filters
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Categories Sidebar */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className='space-y-2'>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className='text-sm text-gray-500'>
                      {category.count}
                    </span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div className='lg:col-span-3 space-y-4'>
          {posts.map((post) => (
            <Card key={post.id} className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                      {post.isPinned && (
                        <PinTopIcon className='h-4 w-4 text-blue-600' />
                      )}
                      <h3 className='font-semibold text-gray-900 truncate'>
                        {post.title}
                      </h3>
                    </div>

                    <p className='text-sm text-gray-500 mb-3'>{post.preview}</p>

                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                      <span className='font-medium'>{post.author.name}</span>
                      <div className='flex items-center gap-1'>
                        <BiMessageSquare className='h-4 w-4' />
                        {post.replies}
                      </div>
                      <div className='flex items-center gap-1'>
                        <FaThumbsUp className='h-4 w-4' />
                        {post.likes}
                      </div>
                      <div className='flex items-center gap-1'>
                        <FaClock className='h-4 w-4' />
                        {post.lastActivity}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamForum;
