import { useContext, createContext } from 'react';
import MicroStudioClient from '../lib/MicroStudioApi';
import { Project, Achievement } from '../types/microstudio-api';

export interface MicroStudioContextProps {
  client: MicroStudioClient | null;
  login: (nick: string, password: string) => Promise<void>;
  listProjects: () => Promise<void>;
  selectProject: (project: Project) => Promise<void>;
  projects: Project[];
  currentProject: Project | null;
  achievements: Achievement[];
}

export const MicroStudioContext = createContext<MicroStudioContextProps | null>(
  null
);
export const useMicroStudio = (): MicroStudioContextProps => {
  const contextResponse = useContext(MicroStudioContext);
  if (!contextResponse) {
    throw new Error('useMicroStudio must be used within a MicroStudioProvider');
  }
  return contextResponse;
};
