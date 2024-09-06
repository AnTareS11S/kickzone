import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

const ContactPage = () => {
  return (
    <Card className='mx-auto max-w-md'>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='first-name'>First Name</Label>
              <Input id='first-name' placeholder='John' required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='last-name'>Last Name</Label>
              <Input id='last-name' placeholder='Doe' required />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              placeholder='How can we help you?'
              className='min-h-[100px]'
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type='submit' className='w-full'>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContactPage;
