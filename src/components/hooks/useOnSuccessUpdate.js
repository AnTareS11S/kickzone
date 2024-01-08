import { useEffect } from 'react';

export const useOnSuccessUpdate = (updateSuccess, onSuccess) => {
  useEffect(() => {
    if (updateSuccess) {
      onSuccess();
    }
  }, [updateSuccess, onSuccess]);
};
