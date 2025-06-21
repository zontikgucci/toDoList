import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';

export const useRequestGetToDo = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const toDoDbRef = ref(db, 'todos');

    return onValue(toDoDbRef, (snapshot) => {
      const loadedToDo = snapshot.val() || {};

      const loadedToDoArray = Object.keys(loadedToDo).map((id) => ({
        id,
        ...loadedToDo[id],
      }));

      setTodos(loadedToDoArray);
      setIsLoading(false);
    });
  }, []);

  return {
    isLoading,
    todos,
  };
};
