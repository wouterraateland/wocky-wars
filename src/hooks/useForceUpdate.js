import { useCallback, useState } from "react";

const useForceUpdate = () => {
  const [, setState] = useState(false);
  const forceUpdate = useCallback(() => setState((state) => !state), []);

  return forceUpdate;
};

export default useForceUpdate;
