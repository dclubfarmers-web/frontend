import API from './axios';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
