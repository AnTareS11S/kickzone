import { useEffect, useState } from 'react';

export const GetTeamForumCategories = (isChanged) => {
  const [categories, setCategories] = useState([]);
  const [categoriesToSelect, setCategoriesToSelect] = useState([
    {
      id: '',
      name: '',
      count: 0,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/team-forum-categories`);
        const data = await res.json();
        setCategories(data);
        setCategoriesToSelect(
          data?.map((category) => ({
            id: category?._id,
            name: category?.name,
            count: category?.count,
          }))
        );
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isChanged]);

  return { categories, categoriesToSelect, loading, error };
};
