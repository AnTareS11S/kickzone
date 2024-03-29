import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

import { MinusCircledIcon, TrashIcon } from '@radix-ui/react-icons';

const TableModal = ({ title, desc, items, handleDelete }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MinusCircledIcon className='w-5 h-5 cursor-pointer' />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[525px] overflow-y-auto max-h-[400px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow className='justify-between'>
              <TableHead>Team</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(items) &&
              items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <TrashIcon
                      className='w-5 h-5 cursor-pointer'
                      onClick={() => handleDelete(item._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <DialogFooter>
          <DialogClose asChild>
            <Button className='bg-primary-500 text-white hover:bg-purple-500 hover:text-white'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableModal;
