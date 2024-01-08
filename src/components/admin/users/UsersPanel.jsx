/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import CustomDataTable from '../../CustomDataTable';
import { fetchUsersDataForTable } from '../../../lib/apiUtils';

const UsersPanel = ({ columns }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsersDataForTable(setUsers, updateSuccess);
    setUpdateSuccess(false);
  }, [updateSuccess]);

  return <CustomDataTable columns={columns} data={users} pending pagination />;
};

export default UsersPanel;
