import { useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import PageHeader from '../../components/PageHeader';
import NewThreadModal from '../../components/forum/NewThreadModal';
import ThreadList from '../../components/forum/ThreadList';
import Spinner from '../../components/Spinner';
import { useSelector } from 'react-redux';

const TeamForum = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchThreads = async () => {
        const res = await fetch('/api/forum/threads');
        const data = await res.json();
        setThreads(data);
      };

      fetchThreads();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isChanged]);

  // Example data - replace with real data from your backend
  const categories = [
    { id: 'all', name: 'All Topics', count: 45 },
    { id: 'announcements', name: 'Announcements', count: 12 },
    { id: 'tactics', name: 'Tactics & Strategy', count: 15 },
    { id: 'training', name: 'Training', count: 8 },
    { id: 'social', name: 'Team Social', count: 10 },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-8xl mx-auto p-6'>
      {/* Header */}
      <PageHeader
        title='Team Forum'
        description='Connect, discuss, and stay updated with your team'
      />

      <NewThreadModal author={currentUser} isChanged={setIsChanged} />

      {/* Search */}
      <div className='mb-6'>
        <div className='flex gap-4'>
          <Input placeholder='Search discussions...' className='max-w-md' />
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

        <ThreadList threads={threads} role={currentUser?.role} />
      </div>
    </div>
  );
};

export default TeamForum;
