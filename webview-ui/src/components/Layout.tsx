import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import TopNav from './TopNav';
import { useMicroStudio } from '../hooks/useMicroStudio';

export default function Layout() {
  const { client } = useMicroStudio();
  const navigate = useNavigate();

  useEffect(() => {
    if (!client) {
      navigate('/login');
    }
  }, [client, navigate]);
  return (
    <div className="w-full h-full bg-[#19252c]">
      <TopNav />
      <Outlet />
    </div>
  );
}
