import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import FAQView from '../../components/home/faq/FAQView';
import { FaHome, FaMailBulk, FaPhone, FaUser } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';

const ContactInfo = ({ icon: Icon, label, value }) => (
  <div className='flex items-center space-x-4 p-4 bg-gray-50 rounded-lg'>
    <Icon className='h-6 w-6 text-blue-500' />
    <div>
      <p className='text-sm font-medium text-gray-500'>{label}</p>
      <p className='text-base font-semibold text-gray-900'>{value}</p>
    </div>
  </div>
);

const ContactPage = () => {
  const [contactInfo, setContactInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await fetch('/api/admin/contactOne');
        if (!res.ok) throw new Error('Failed to fetch contact info');
        const data = await res.json();
        setContactInfo(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact info:', error);
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className='container mx-auto px-4 py-12'>
      <div className='space-y-12'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <ContactInfo
              icon={FaUser}
              label='Contact Person'
              value={contactInfo.name + ' ' + contactInfo.lastName}
            />
            <ContactInfo
              icon={FaMailBulk}
              label='Email Address'
              value={contactInfo.email}
            />
            <ContactInfo
              icon={FaPhone}
              label='Phone Number'
              value={contactInfo.phone}
            />
            <ContactInfo
              icon={FaHome}
              label='Office Location'
              value={contactInfo.address}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FAQView />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
