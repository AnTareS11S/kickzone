/* eslint-disable no-unused-vars */
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';

const uploadFile = async (file, setFileCallback, setUploadProgressCallback) => {
  if (!file) return;

  const name = new Date().getTime() + '-' + file.name;
  const storageRef = ref(storage, `avatars/${name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Handle state change events such as progress, pause, and resume
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setUploadProgressCallback(progress);
    },
    (error) => {
      // Handle unsuccessful uploads
      console.error('Error during file upload:', error.message);
    },
    async () => {
      // Handle successful uploads on complete
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        // Instead of setting the entire file object, pass only the URL
        setFileCallback(downloadURL);
      } catch (error) {
        console.error('Error getting download URL:', error.message);
      }
    }
  );
};

export default uploadFile;
