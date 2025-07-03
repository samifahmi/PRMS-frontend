// filepath: /home/jared/Documents/Sami/prms-frontend/src/utils/responseHandler.js
const handleApiResponse = (response) => {
  if (!response.ok) {
    return Promise.reject({
      status: response.status,
      message: response.statusText,
    });
  }
  return response.json();
};

const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    status: error.status || 500,
    message: error.message || 'An unexpected error occurred.',
  };
};

export { handleApiResponse, handleApiError };