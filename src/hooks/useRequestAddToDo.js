import { useState } from 'react';

export const useRequestAddToDo = ({ URL_TODOS, setTriggerRefetch, setTitleToDo, setError }) => {
  const [isCreating, setIsCreating] = useState(true);

  const requestAddToDo = (title) => {
    setError(null);
    fetch(`${URL_TODOS}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        title,
        completed: false,
      }),
    })
      .then((rawResponse) => {
        if (!rawResponse.ok) {
          throw new Error(`HTTP error! status: ${rawResponse.status}`);
        }
        return rawResponse.json();
      })
      .then(() => {
        setTitleToDo('');
        setTriggerRefetch((prev) => !prev);
      })
      .catch((err) => {
        console.error('Ошибка добавления задачи:', err);
        setError('Не удалось добавить задачу. Пожалуйста, попробуйте еще раз.');
      })
      .finally(() => setIsCreating(true));
  };

  return {
    isCreating,
    setIsCreating,
    requestAddToDo,
  };
};
