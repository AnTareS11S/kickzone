import { TbFileText } from 'react-icons/tb';

const DownloadRequest = ({ row, onEntityUpdated }) => {
  const handleTextDownload = () => {
    try {
      // Create a nicely formatted text version
      const formatValue = (value) => {
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value, null, 2);
        }
        return String(value);
      };

      // Custom text formatting
      let textContent = `========================================\n`;
      textContent += `REQUEST DETAILS: ${row._id || 'DATA'}\n`;
      textContent += `========================================\n\n`;

      // Get the longest key for alignment
      const longestKey = Object.keys(row).reduce(
        (max, key) => Math.max(max, key.length),
        0
      );

      // Format each key-value pair
      Object.entries(row).forEach(([key, value]) => {
        // Pad the key for alignment
        const paddedKey = key.padEnd(longestKey + 2);
        textContent += `${paddedKey}: ${formatValue(value)}\n\n`;
      });

      textContent += `========================================\n`;
      textContent += `Generated on: ${new Date().toLocaleString()}\n`;
      textContent += `========================================\n`;

      // Create blob and download link
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      // Create download link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `request-${row._id || 'data'}.txt`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      if (onEntityUpdated) {
        onEntityUpdated();
      }
    } catch (error) {
      console.error('Error downloading text:', error);
    }
  };

  return (
    <div>
      <button
        onClick={handleTextDownload}
        className='p-1 rounded hover:bg-gray-100'
      >
        <TbFileText size={20} className='text-gray-600 hover:text-purple-500' />
      </button>
    </div>
  );
};

export default DownloadRequest;
