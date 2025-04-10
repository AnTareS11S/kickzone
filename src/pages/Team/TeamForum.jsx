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
import { GetTeamForumCategories } from '../../api/getTeamForumCategories';
import ForumNotifications from '../../components/forum/ForumNotifications';

const TeamForum = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const { categories, loading: isCategoriesLoading } =
    GetTeamForumCategories(isChanged);

  const allCategories = [
    { id: 'all', name: 'All Topics', count: threads.length },
    ...(categories || []),
  ];

  useEffect(() => {
    try {
      const fetchThreads = async () => {
        setIsLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/forum/threads/${
            currentUser?._id
          }/${currentUser?.role}`
        );
        const data = await res.json();
        setThreads(data);
      };

      fetchThreads();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [isChanged, currentUser]);

  useEffect(() => {
    let filtered = threads;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(
        (thread) => thread.category === activeCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((thread) =>
        thread.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredThreads(filtered);
  }, [activeCategory, searchTerm, threads]);

  return (
    <div className='max-w-8xl mx-auto p-6'>
      {/* Header */}

      <PageHeader
        title='Team Forum'
        description='Connect, discuss, and stay updated with your team'
        isBack={false}
      />

      <div className='mb-6 flex items-center gap-4'>
        <NewThreadModal author={currentUser} isChanged={setIsChanged} />

        <ForumNotifications
          userId={currentUser?._id}
          role={currentUser?.role}
        />
      </div>

      {/* Search */}
      <div className='mb-6'>
        <div className='flex gap-4'>
          <Input
            placeholder='Search discussions...'
            className='max-w-md'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              {isCategoriesLoading ? (
                <div className='flex justify-center py-4'>
                  <Spinner />
                </div>
              ) : (
                <nav className='space-y-2'>
                  {allCategories.map((category) => (
                    <button
                      key={category?.id}
                      onClick={() => setActiveCategory(category?.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${
                        activeCategory === category?.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>{category?.name}</span>
                      <span className='text-sm text-gray-500'>
                        {category?.id === 'all'
                          ? threads.length
                          : category?.count}
                      </span>
                    </button>
                  ))}
                </nav>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className='lg:col-span-3 flex justify-center py-4'>
            <Spinner />
          </div>
        ) : (
          <ThreadList threads={filteredThreads} />
        )}
      </div>
    </div>
  );
};

export default TeamForum;
