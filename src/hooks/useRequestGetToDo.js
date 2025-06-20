import { useEffect, useState } from 'react';

export const useRequestGetToDo = ({ URL_TODOS, triggerRefetch, setError }) => {
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`${URL_TODOS}/todos`)
      .then((loadedData) => {
        if (!loadedData.ok) {
          throw new Error(`HTTP error! status: ${loadedData.status}`);
        }
        return loadedData.json();
      })
      .then((loadedToDos) => {
        setTodos(loadedToDos);
        setAllTodos(loadedToDos);
      })
      .catch((err) => {
        console.error('Ошибка загрузки задач:', err);
        setError('Не удалось загрузить задачи. Пожалуйста, попробуйте еще раз.');
      })
      .finally(() => setIsLoading(false));
  }, [triggerRefetch]);

  return {
    isLoading,
    todos,
    allTodos,
    setTodos,
    setAllTodos,
  };
};
