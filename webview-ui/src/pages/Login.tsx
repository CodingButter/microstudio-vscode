import { MouseEvent } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMicroStudio } from '../hooks/useMicroStudio';
import Logo from '../assets/microstudiologo.svg';

export default function Login() {
  const navigate = useNavigate();
  const { login, client } = useMicroStudio();
  const [nick, setNick] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleOnSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(nick, password);
    login(nick, password);
  };

  useEffect(() => {
    if (client) {
      navigate('/projects');
    }
  }, [client, navigate]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Micro Studio" src={Logo} className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign In
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="nick"
                className="block text-sm/6 font-medium text-white"
              >
                Nickname
              </label>
              <div className="mt-2">
                <input
                  onChange={(e) => setNick(e.target.value)}
                  id="nick"
                  name="nick"
                  type="text"
                  required
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                onClick={handleOnSubmit}
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
