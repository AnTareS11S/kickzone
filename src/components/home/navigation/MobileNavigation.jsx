import { useMemo } from 'react';

const MobileNavigation = ({ visibleLinks, renderLinks }) => {
  const gridColsClass = useMemo(() => {
    const cols = visibleLinks.length;
    // Map number of links to appropriate grid columns class
    switch (cols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      case 5:
        return 'grid-cols-5';
      case 6:
        return 'grid-cols-6';
      case 7:
        return 'grid-cols-7';
      case 8:
        return 'grid-cols-8';
      default:
        return 'grid-cols-4'; // fallback value
    }
  }, [visibleLinks.length]);

  return (
    <nav className='md:hidden fixed bottom-0 left-0 z-50 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg'>
      <div className={`p-2 grid ${gridColsClass} gap-1`}>{renderLinks()}</div>
    </nav>
  );
};

export default MobileNavigation;
