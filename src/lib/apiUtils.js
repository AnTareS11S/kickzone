/* eslint-disable no-unused-vars */
const fetchCoaches = async () => {
  try {
    const res = await fetch('/api/admin/coaches');
    const data = await res.json();
    return data.map(
      (coach) => coach.name + ' ' + coach.surname + ':' + coach._id
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

const fetchTeamDataForTable = async (setTableData, updateSuccess) => {
  try {
    const res = await fetch('/api/admin/teams');
    const data = await res.json();
    if (data.success === false) {
      console.log(data);
      return;
    }
    setTableData(data);
  } catch (error) {
    console.log(error);
  }
};

const fetchLeagueDataForTable = async (setTableData, updateSuccess) => {
  try {
    const res = await fetch('/api/admin/leagues');
    const data = await res.json();
    if (data.success === false) {
      console.log(data);
      return;
    }
    setTableData(data);
  } catch (error) {
    console.log(error);
  }
};

export { fetchCoaches, fetchTeamDataForTable, fetchLeagueDataForTable };
