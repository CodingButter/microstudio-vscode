import { useRouteError } from 'react-router';

export interface MyError {
  data: string;
  internal: boolean;
  status: number;
  statusText: string;
  error: Error;
}
const ErrorBoundary = () => {
  const error: MyError = useRouteError() as MyError;
  console.log(error);
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">
          {error && error?.internal ? 'Internal Error' : 'External Error'}
        </p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          {error?.statusText || error?.status || 'Error'}
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          {error?.error?.message}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </a>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        {error?.error?.stack && (
          <pre className="bg-slate-600 shadow-md p-4 rounded-md mt-2 text-white text-left max-h-96 overflow-auto border-slate-900 border-2">
            {error?.error?.stack}
          </pre>
        )}
      </div>
    </main>
  );
};
export default ErrorBoundary;
