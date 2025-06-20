export const useRequestUpdateToDo = ({ URL_TODOS, setTriggerRefetch, setError }) => {
  const requestCompletedToDo = (id, title, isCompleted) => {
    setError(null);
    fetch(`${URL_TODOS}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        title,
        completed: !isCompleted,
      }),
    })
      .then((rawResponse) => {
        if (!rawResponse.ok) {
          throw new Error(`HTTP error! status: ${rawResponse.status}`);
        }
        return rawResponse.json();
      })
      .then(() => setTriggerRefetch((prev) => !prev))
      .catch((err) => {
        console.error('Ошибка обновления задачи:', err);
        setError('Не удалось обновить статус задачи. Пожалуйста, попробуйте еще раз.');
      });
  };

  return {
    requestCompletedToDo,
  };
};
