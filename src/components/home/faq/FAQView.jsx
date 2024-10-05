import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQView = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/admin/faq');
        if (!res.ok) throw new Error('Failed to fetch faqs');
        const data = await res.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching faqs:', error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='border-b border-gray-200 py-4'>
      <button
        className='flex w-full items-center justify-between text-left'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className='text-lg font-semibold text-gray-900'>{question}</h3>
        {isOpen ? (
          <FaChevronUp className='h-5 w-5 text-gray-500' />
        ) : (
          <FaChevronDown className='h-5 w-5 text-gray-500' />
        )}
      </button>
      {isOpen && (
        <div className='mt-2 text-gray-600'>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQView;
