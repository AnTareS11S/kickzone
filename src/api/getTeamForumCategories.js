import { useEffect, useState } from 'react';

export const GetTeamForumCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesToSelect, setCategoriesToSelect] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/team-forum-categories`);
        const data = await res.json();
        setCategories(data);
        setCategoriesToSelect(
          data.map((category) => category.name + ':' + category._id)
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
  }, []);

  return { categories, categoriesToSelect, loading, error };
};
