import React, { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

const TermsPage = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch('/api/admin/terms');
        const data = await response.json();
        setTerms(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Terms and Conditions</h1>
      {terms.map((term, index) => (
        <Card key={term._id || index} className='mb-4'>
          <CardHeader>
            <CardTitle>{term.term}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-700'>{term.definition}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TermsPage;
