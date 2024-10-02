import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import Spinner from '../../components/Spinner';

const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/admin/aboutOne');
        const data = await res.json();
        setAbout(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner className='w-12 h-12 text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {about && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'
        >
          <div className='text-center'>
            <h1 className='text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl'>
              {about.title}
            </h1>
            <p className='mt-6 max-w-2xl mx-auto text-xl text-gray-500'>
              {about.description}
            </p>
          </div>

          <div className='mt-16'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className='relative aspect-video rounded-xl overflow-hidden shadow-2xl'
            >
              <img
                className='absolute inset-0 w-full h-full object-cover'
                src={about.imageUrl}
                alt='KickZone in Action'
              />
            </motion.div>
          </div>

          <div className='mt-20 grid gap-16 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className='text-3xl font-bold text-gray-900'>Our Mission</h2>
              <p className='mt-4 text-lg text-gray-600 leading-relaxed'>
                {about.mission}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className='text-3xl font-bold text-gray-900'>
                Why KickZone?
              </h2>
              <p className='mt-4 text-lg text-gray-600 leading-relaxed'>
                {about.whyUs}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AboutPage;
