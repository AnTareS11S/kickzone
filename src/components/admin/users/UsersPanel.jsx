import CustomDataTable from '../../CustomDataTable';
import { useFetchUsers } from '../../hooks/useFetchUsers';

const UsersPanel = ({ columns }) => {
  const users = useFetchUsers();

  return <CustomDataTable columns={columns} data={users} pending pagination />;
};

export default UsersPanel;
