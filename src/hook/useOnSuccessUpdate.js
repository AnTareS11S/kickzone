import { useEffect } from 'react';

export const useOnSuccessUpdate = (updateSuccess, onSuccess) => {
  useEffect(() => {
    if (updateSuccess) {
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSuccess]);
};
