import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Activity = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [activity, setActivity] = useState([]);

  console.log(currentUser);

  useEffect(() => {
    const getActivity = async () => {
      try {
        const response = await fetch(`/api/user/activity/${currentUser._id}`);
        const data = await response.json();

        setActivity(data);
      } catch (error) {
        console.log(error);
      }
    };
    getActivity();
  }, [currentUser._id]);

  return (
    <section>
      <h1 className='head-text text-dark-2 mb-10'>Activity</h1>
      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} to={`/post/${activity.parentId}`}>
                <article className='activity-card'>
                  <img
                    src={activity.author.photo}
                    alt='Profile picture'
                    width={20}
                    height={20}
                    className='rounded-full object-contain'
                  />
                  <p className='!text-small-regular text-dark-1'>
                    <span className='mr-1 text-purple-900'>
                      {activity.author.username}
                    </span>{' '}
                    replied to your post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-33'>No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Activity;
