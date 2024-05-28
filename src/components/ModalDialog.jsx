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

const ModalDialog = ({ title, description, handleClick, type }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {type === 'button' ? (
          <Button
            variant='outline'
            className='mt-4 sm:mt-4 bg-red-600 text-white hover:bg-red-700 hover:text-white'
          >
            {title}
          </Button>
        ) : (
          <TrashIcon className='w-5 h-5 p-0 cursor-pointer text-red-600' />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-red-600 hover:bg-red-700'
            onClick={handleClick}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDialog;
