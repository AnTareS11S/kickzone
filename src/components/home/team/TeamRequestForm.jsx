import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { useToast } from '../../ui/use-toast';

const TeamRequestForm = ({ onSuccess, countries }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
      bio: '',
      coach: '',
      stadium: '',
      foundedYear: '',
      country: '',
      sponsor: '',
      city: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/add/team-request-form`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        toast({
          title: 'Success!',
          description: 'Team request submitted successfully',
        });
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: 'Error!',
          description: 'Failed to submit team request',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting team request:', error);
      toast({
        title: 'Error!',
        description: 'Failed to submit team request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1850 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 font-semibold text-gray-900'
      >
        <FormField
          control={form.control}
          name='name'
          rules={{ required: 'Team name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter team name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='country'
            rules={{ required: 'Country is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select country' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries?.map((country) => (
                      <SelectItem key={country?.id} value={country?.id}>
                        {country?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='city'
            rules={{ required: 'City is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder='Enter city' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='foundedYear'
            rules={{ required: 'Founded year is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founded Year</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select year' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='stadium'
            rules={{ required: 'Stadium name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stadium</FormLabel>
                <FormControl>
                  <Input placeholder='Enter stadium name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='coach'
            rules={{ required: 'Coach name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coach</FormLabel>
                <FormControl>
                  <Input placeholder='Enter coach name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='sponsor'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sponsor</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter main sponsor (optional)'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='bio'
          rules={{ required: 'Team bio is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a brief description of the team's history and achievements"
                  className='min-h-32'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include important details about the team&apos;s history,
                achievements, and notable facts.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              form.reset();
              if (onSuccess) onSuccess();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='bg-primary-500 hover:bg-purple-500'
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamRequestForm;
