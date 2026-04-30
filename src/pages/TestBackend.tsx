import { useEffect, useState } from 'react';
import api from '../lib/api';

function TestBackend() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    api.get('/ping')
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.message));
  }, []);

  return <div>{message}</div>;
}

export default TestBackend;
