import { useMemo, useState } from 'react';

function useLoading() {
  const [list, setList] = useState([]);

  function add() {
    setList((list) => {
      list.push(1);
      return [...list];
    });
  }

  function pop() {
    setList((list) => {
      list.pop();
      return [...list];
    });
  }

  const uploading = useMemo(() => {
    if (list.length === 0) return false;
    return true;
  }, [list]);

  return {
    add,
    pop,
    uploading,
  };
}

export default useLoading;
