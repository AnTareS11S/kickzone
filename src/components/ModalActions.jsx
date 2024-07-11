import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Form } from './ui/form';
import FormArea from './FormArea';
import {
  Pencil1Icon,
  PlusCircledIcon,
  EnvelopeClosedIcon,
} from '@radix-ui/react-icons';

const ModalActions = ({
  label,
  title,
  onSubmit,
  data,
  fields,
  edit,
  form,
  isRole,
  isMessage,
  add,
  setFile,
  isOpen,
  onClose,
  onOpen,
}) => {
  const fileRef = useRef(null);

  useEffect(() => {
    if (data) {
      form.reset({ ...data });
    }
  }, [data, form]);

  const renderTrigger = () => {
    if (edit)
      return (
        <Pencil1Icon className='w-5 h-5 cursor-pointer  hover:text-primary-500 transition-colors' />
      );
    if (add)
      return (
        <PlusCircledIcon className='w-5 h-5 cursor-pointer  hover:text-primary-500 transition-colors' />
      );
    if (isMessage)
      return (
        <EnvelopeClosedIcon className='w-5 h-5 cursor-pointer hover:text-primary-500 transition-colors' />
      );
    return (
      <Button
        variant='outline'
        className='bg-primary-500 text-white hover:bg-primary-600 transition-colors'
      >
        {label}
      </Button>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
      <DialogContent className='sm:max-w-[825px] w-full mx-auto '>
        <div className='max-h-[80vh] overflow-y-auto p-6'>
          <DialogHeader>
            <DialogTitle className='text-body-semibold mb-2'>
              {title}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {isRole && (
                <div className='bg-gray-100 p-4 rounded-lg'>
                  <p className='text-sm font-medium'>
                    User <span className='font-bold'>{data.username}</span>{' '}
                    wants to have the role:{' '}
                    <span className='italic'>{data.wantedRole}</span>
                  </p>
                </div>
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {fields.map((field) => (
                  <FormArea
                    key={field.id}
                    {...field}
                    form={form}
                    isEdit={edit}
                    fileRef={field.type === 'file' ? fileRef : null}
                    setFile={field.type === 'file' ? setFile : null}
                  />
                ))}
              </div>
              <DialogFooter>
                <Button
                  type='submit'
                  className='w-full sm:w-auto bg-primary-500 text-white hover:bg-primary-600 transition-colors'
                >
                  {title}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalActions;
