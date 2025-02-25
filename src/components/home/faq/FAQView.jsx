import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQView = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null); // Active FAQ index

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/faq`
        );
        if (!res.ok) throw new Error('Failed to fetch faqs');
        const data = await res.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching faqs:', error);
      }
    };

    fetchFaqs();
  }, []);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle open FAQ
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='space-y-4'>
        {faqs
          .filter((faq) => faq.active)
          .map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={activeIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className='border-b border-gray-200 py-4'>
      <button
        className='flex w-full items-center justify-between text-left'
        onClick={onToggle}
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
