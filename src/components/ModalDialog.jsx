import { useState } from 'react';
import { TbLoader2 } from 'react-icons/tb';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Button } from '../components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';

const MotionTrashIcon = motion(TrashIcon);

const ModalDialog = ({ title, description, handleClick, type, isDeleting }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {type === 'button' ? (
          <Button
            variant='outline'
            className='relative overflow-hidden group bg-red-600 text-white hover:bg-red-700 hover:text-white rounded-md transition-all duration-200 ease-in-out'
          >
            <span className='relative z-10 flex items-center gap-2'>
              {isDeleting ? (
                <TbLoader2 className='w-4 h-4 animate-spin' />
              ) : (
                <TrashIcon className='w-4 h-4' />
              )}
              {title}
            </span>
            <div className='absolute inset-0 bg-red-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out' />
          </Button>
        ) : (
          <div className='relative inline-block'>
            <MotionTrashIcon
              className='w-5 h-5 cursor-pointer text-red-600 hover:text-red-700 transition-colors duration-200'
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className='absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap'
              >
                Delete
              </motion.div>
            )}
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className='sm:max-w-[425px] bg-white dark:bg-gray-800 shadow-2xl'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-gray-600 dark:text-gray-300 mt-2'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-6 gap-2'>
          <AlertDialogCancel
            disabled={isDeleting}
            className='bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors duration-200'
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className='relative overflow-hidden bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed'
            onClick={handleClick}
            disabled={isDeleting}
          >
            <motion.span
              className='flex items-center justify-center gap-2'
              initial={false}
              animate={{
                opacity: isDeleting ? 0.8 : 1,
                scale: isDeleting ? 0.98 : 1,
              }}
            >
              {isDeleting ? (
                <>
                  <TbLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <TrashIcon className='h-4 w-4' />
                  <span>Delete</span>
                </>
              )}
            </motion.span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDialog;
