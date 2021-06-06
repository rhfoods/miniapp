import { useEffect, useState } from 'react';

function useCount(params) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (params?.count) {
      setCount(params?.count);
    }
  }, [params]);

  return count;
}

export default useCount;
