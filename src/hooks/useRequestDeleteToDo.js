export const useRequestDeleteToDo = ({ URL_TODOS, setTriggerRefetch, setError }) => {
  const requestDeleteToDo = (id) => {
    setError(null);
    fetch(`${URL_TODOS}/todos/${id}`, {
      method: 'DELETE',
    })
      .then((rawResponse) => {
        if (!rawResponse.ok) {
          throw new Error(`HTTP error! status: ${rawResponse.status}`);
        }
      })
      .then(() => setTriggerRefetch((prev) => !prev))
      .catch((err) => {
        console.error('Ошибка удаления задачи:', err);
        setError('Не удалось удалить задачу. Пожалуйста, попробуйте еще раз.');
      });
  };

  return {
    requestDeleteToDo,
  };
};
