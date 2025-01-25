import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { GetTeamForumCategoriesToSelect } from '../../api/getTeamForumCategories';
import { Form } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forumFormSchema } from '../../lib/validation/ForumValidation';
import FormArea from '../FormArea';
import { TbLoader2 } from 'react-icons/tb';
import { useSocket } from '../../hook/useSocket';

const NewThreadModal = ({ author, isChanged }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { categoriesToSelect: categories } = GetTeamForumCategoriesToSelect();
  const { emit } = useSocket();

  const form = useForm({
    resolver: zodResolver(forumFormSchema()),
    defaultValues: {
      title: '',
      content: '',
      category: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/forum/new-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          authorId: author._id,
          authorModel: author.role,
        }),
      });
      if (!res.ok) {
        throw new Error('Cannot create new thread');
      }

      const thread = await res.json();

      emit('initializeTeamForumNotifications', {
        teamId: thread.teamId,
      });

      setIsLoading(true);
      isChanged((prev) => !prev);
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className='bg-primary-500 hover:bg-purple-500 my-4'
      >
        New Thread
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-2'>
                <FormArea
                  id='title'
                  label='Title'
                  type='text'
                  form={form}
                  name='title'
                  placeholder='Enter thread title...'
                />
              </div>

              <div className='space-y-2'>
                <FormArea
                  id='category'
                  label='Category'
                  type='select'
                  form={form}
                  name='category'
                  placeholder='Select a category'
                  items={categories}
                  idFlag={true}
                />
              </div>

              <div className='space-y-2'>
                <FormArea
                  id='content'
                  label='Content'
                  type='textarea'
                  form={form}
                  name='content'
                  placeholder='Write your thread content...'
                  className='max-h-[150px]'
                />
              </div>

              <DialogFooter>
                <Button
                  type='submit'
                  className='bg-primary-500 hover:bg-purple-500'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className='flex items-center gap-2'>
                      <TbLoader2 className='w-4 h-4 animate-spin' />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <p>Create Thread</p>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewThreadModal;
