import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';

const TeamCard = ({ data }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
      {data.map((team) => (
        <Link key={team._id} to={`/league/team/${team._id}`}>
          <Card className='flex flex-col h-56'>
            <img
              src={
                team.logo
                  ? team.logoUrl
                  : 'https://futbolistpro-bucket.s3.eu-north-1.amazonaws.com/team_img_default.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaCmV1LW5vcnRoLTEiRjBEAiBS1uG5sMeRMc%2F432nyEm26GAkpVyBJOlbE0SIiLZlWlAIgL3vcO7areLwPoNTr0aXHcYMbtFgPctcET3W0vNMYGHEq7QII1P%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2NTQ2NTQyNDk4ODMiDKtV%2FDcIGCPRDlZNFirBAoav%2FELUkRIhbV2p1mXUIv53csMI1VzJ92JIoXPjP8ggIGDE%2B%2F%2BZHb5ZTlkADlHJLIfuB48T%2F1qJj6YnIDKdnpBVBUEwbBDFTFmosAQUy73GogYXfkameaN%2FdFR0D11jH%2FTxfk4MxooF5D%2FhiGbKLHq%2BmJlvRcWF0LB%2BUY7a6S7rqOVm1Z%2FV91HiL%2BL0NH10aQGcP3dLYMpb0caEXOwBzml5OJqdoRIHWA5abJbkTWBUoaV11P7Q%2BBiTasoT2%2BvUsxr7oXBPD8pMige97dExiXxPyKYQ3s3Xpf9FakncKELu1TrS4etLJbBoJ%2FaQcuoRtV1DH%2BabdhF%2BieHwtJKvvElv42B%2BbeSXqrTWweD6Qv47ojUwTT1SQkinAN44ef0AQnZE7nqrZsEEar0so%2Fr4g1YEd0ZuiZpmf0UZ%2FBEPS0%2Fa0jDWguixBjq0AoZ8zGAmRUhXJbp5t5X7FEOws%2B%2Fv7JZ1%2F%2FfF5x3lE9QLhCmk0KE5tsazoK9hbfnY90wz9DVlJ%2BGy8ozN46xoYbjRJ6aw%2FYg8l8POZ7WZ152h2r241yfuo4zHL6va31F%2BdJI5P3HikT6cNZHhXZoP3AqJymEoMFXZY6ok5cR8iwrWY89A1rOuwgLWZrNhIVgnpYOLr8wqfgg3g5sQGN41XhbHNjiMbGGcOQ%2FV7Tj%2Fd4zxmlSNExw730yitnq3EKsDUm2f3YcvO5MAkusECf8Uka5x%2Bboa8IHAQwp%2BkK%2BW%2FEcsMIB%2B1YgvrUwHxElBahVYIBHmfY1BGwEWVWBfx1l%2F%2FsWYsYLZV4zE237dZhrr2JoJxs1x%2BDD%2BOX4cELHXjdDXFpA7es2gkrLl407FrMoReSrXA37K&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240507T140928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAZQ3DPDONWVCFKRPP%2F20240507%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=11d6fefc497d0a615490b8c3a96ab243607bcd9e3c351d6e4a200dee38b70f02'
              }
              alt={`Logo of ${team.name}`}
              className='object-contain w-full h-36'
            />
            <CardContent className='flex-grow flex flex-col justify-between'>
              <h3 className='text-heading3-bold text-center mt-3'>
                {team.name}
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TeamCard;
