import { vscode } from '../utilities/vscode';
import { useEffect, useState } from 'react';

const useStates = <T>(
  key: string,
  initialState: T
): [T, (currentState: T) => void] => {
  const [value, setValue] = useState<T>(
    vscode.getState<T>(key) || initialState
  );

  useEffect(() => {
    if (value) vscode.setState<T>(key, value);
  }, [value, key]);

  return [value, setValue];
};
export default useStates;
