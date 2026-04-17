import API from './axios';

export const getJobs = async () => {
  const { data } = await API.get('/jobs');
  return data;
};

export const createJob = async (jobData) => {
  const { data } = await API.post('/jobs', jobData);
  return data;
};

export const applyToJob = async (applicationData) => {
  const { data } = await API.post('/jobs/apply', applicationData);
  return data;
};
