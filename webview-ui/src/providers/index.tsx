import MyRouterProvider from './MyRouterProvider';
import { MicroStudioProvider } from './MicroStudioProvider';

const Providers = () => {
  return (
    <MicroStudioProvider>
      <MyRouterProvider />
    </MicroStudioProvider>
  );
};
export default Providers;
