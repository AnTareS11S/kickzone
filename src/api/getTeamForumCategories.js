import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const GetTeamForumCategories = (isChanged) => {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([
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
        const res = await fetch(
          `/api/admin/team-forum-categories/${currentUser?._id}/${currentUser?.role}`
        );
        const data = await res.json();
        setCategories(
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
  }, [isChanged, currentUser]);

  return { categories, loading, error };
};

export const GetTeamForumCategoriesToSelect = () => {
  const [categoriesToSelect, setCategoriesToSelect] = useState([
    {
      id: '',
      name: '',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/team-forum-categories`);
        const data = await res.json();

        setCategoriesToSelect(
          data?.map((category) => ({
            id: category?._id,
            name: category?.name,
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
  }, []);

  return { categoriesToSelect, loading, error };
};
