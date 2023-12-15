/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ModalActions from '../../ModalActions';

const EditTeam = ({ row }) => {
  const [coaches, setCoaches] = useState([]);
  const coach = row.getValue('coach');

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch('/api/admin/coaches');
        const data = await res.json();
        setCoaches(
          data.map(
            (coach) => coach.name + ' ' + coach.surname + ':' + coach._id
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchCoaches();
  }, []);

  return (
    <div>
      <ModalActions
        label='Add Team'
        title='Add Team'
        desc='Add a new team'
        data={row.original}
        coaches={coaches}
        coach={coach}
      />
    </div>
  );
};

export default EditTeam;
