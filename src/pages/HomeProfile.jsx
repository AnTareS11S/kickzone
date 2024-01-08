import { useSelector } from 'react-redux';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

const profileTabs = [
  { value: 'posts', label: 'Posts', icon: '/reply.svg' },
  { value: 'replies', label: 'Replies', icon: '/members.svg' },
  { value: 'tagged', label: 'Tagged', icon: '/tag.svg' },
];

const HomeProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) return null;

  return (
    <section>
      <div className='mt-9'>
        <Tabs defaultValue='post' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <img
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max:sm:hidden'>{tab.label}</p>
                {tab.label === 'Posts' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {currentUser?.posts?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
      </Tabs>
      </div>
    </section>
  );
};

export default HomeProfile;
