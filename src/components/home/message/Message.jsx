import { getTimeAgo } from '../../../lib/utils';

const Message = ({ message, own }) => {
  return (
    <div className={`mb-2 ${own ? 'text-right' : 'text-left'}`}>
      <span
        className={`inline-block p-2 rounded-lg ${
          own ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        {message?.text}
      </span>
      <div className='text-small-regular text-gray-500 ml-1'>
        {getTimeAgo(message?.createdAt)}
      </div>
    </div>
  );
};

export default Message;
