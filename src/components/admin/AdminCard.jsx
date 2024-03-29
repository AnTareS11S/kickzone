import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../ui/card';

const AdminCard = ({ title, linkTo }) => {
  return (
    <article className='flex flex-wrap gap-7 mt-9'>
      <Card className='w-[250px] h-[100px] max-sm:w-full'>
        <Link to={linkTo}>
          <CardHeader className='items-center pt-10'>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        </Link>
      </Card>
    </article>
  );
};

export default AdminCard;
