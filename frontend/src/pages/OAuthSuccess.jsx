import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import axios from 'axios';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { navigate('/login'); return; }

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    }).then(({ data }) => {
      dispatch(setCredentials({ user: data.user, token }));
      toast.success(`Welcome, ${data.user.name}! 🎉`);
      navigate('/');
    }).catch(() => {
      toast.error('Google login failed');
      navigate('/login');
    });
  }, []);

  return <PageLoader />;
}
