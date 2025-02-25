import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

const PrivacyPage = () => {
  const [privacy, setPrivacy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/privacy`
        );
        const data = await response.json();
        setPrivacy(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPrivacy();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-heading3-bold mb-6'>Privacy Policy</h1>
      {privacy
        .filter((privacy) => privacy.active)
        .map((privacy, index) => (
          <Card key={privacy._id || index} className='mb-4'>
            <CardHeader>
              <CardTitle>{privacy.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700'>{privacy.content}</p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default PrivacyPage;
