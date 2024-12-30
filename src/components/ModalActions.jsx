import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import FormArea from './FormArea';
import { motion } from 'framer-motion';
import { Form } from './ui/form';
import { TbLoader2 } from 'react-icons/tb';
import { Pencil1Icon, PlusCircledIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const ModalActions = ({
  label,
  title,
  onSubmit,
  data,
  fields,
  edit,
  form,
  isRole,
  add,
  setFile,
  isOpen,
  onClose,
  onOpen,
  isLoading,
  loadingIcon,
}) => {
  const fileRef = useRef(null);

  useEffect(() => {
    if (data) {
      form.reset({ ...data });
    }
  }, [data, form]);

  const renderTrigger = () => {
    const commonClasses = 'hover:scale-105 transition-all duration-200';

    if (edit) {
      return (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Pencil1Icon className='w-5 h-5 cursor-pointer text-gray-600 hover:text-primary-500 transition-colors' />
        </motion.div>
      );
    }

    if (add) {
      return (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <PlusCircledIcon className='w-5 h-5 cursor-pointer text-gray-600 hover:text-primary-500 transition-colors' />
        </motion.div>
      );
    }

    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          variant='outline'
          className={`${commonClasses} bg-primary-500 mb-3 text-white hover:bg-primary-600 shadow-md hover:shadow-lg hover:text-white`}
        >
          {label}
        </Button>
      </motion.div>
    );
  };

  const formAnimations = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimations = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
      <DialogContent className='sm:max-w-[825px] w-full mx-auto backdrop-blur-sm bg-white/95'>
        <motion.div
          className='max-h-[80vh] overflow-y-auto p-6'
          initial='hidden'
          animate='visible'
          variants={formAnimations}
        >
          <DialogHeader className='space-y-3'>
            <DialogTitle className='text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent'>
              {title}
            </DialogTitle>
            <DialogDescription className='text-gray-500'></DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 mt-6'
            >
              {isRole && (
                <motion.div
                  variants={itemAnimations}
                  className='bg-primary-50 p-4 rounded-lg border border-primary-200'
                >
                  <p className='text-sm text-gray-700'>
                    User{' '}
                    <span className='font-bold text-primary-700'>
                      {data.username}
                    </span>{' '}
                    wants to have the role:{' '}
                    <span className='italic text-primary-600'>
                      {data.wantedRole}
                    </span>
                  </p>
                </motion.div>
              )}

              <motion.div
                variants={itemAnimations}
                className='grid grid-cols-1 md:grid-cols-2 gap-6'
              >
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    variants={itemAnimations}
                    initial='hidden'
                    animate='visible'
                    transition={{ delay: index * 0.1 }}
                  >
                    <FormArea
                      form={form}
                      isEdit={edit}
                      fileRef={field.type === 'file' ? fileRef : null}
                      setFile={field.type === 'file' ? setFile : null}
                      {...field}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <DialogFooter>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='w-full sm:w-auto'
                >
                  <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full sm:w-auto bg-primary-500 text-white hover:bg-primary-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isLoading ? (
                      <div className='flex items-center gap-2'>
                        {loadingIcon || (
                          <TbLoader2 className='w-4 h-4 animate-spin' />
                        )}
                        <span>Processing...</span>
                      </div>
                    ) : (
                      title
                    )}
                  </Button>
                </motion.div>
              </DialogFooter>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalActions;
