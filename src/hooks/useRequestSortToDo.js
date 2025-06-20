export const useRequestSortToDo = ({ URL_TODOS, setTodos, setAllTodos, setError }) => {
  const onButtonToSorted = () => {
    setError(null);
    fetch(`${URL_TODOS}/todos?_sort=title`)
      .then((rawResponse) => {
        if (!rawResponse.ok) {
          throw new Error(`HTTP error! status: ${rawResponse.status}`);
        }
        return rawResponse.json();
      })
      .then((response) => {
        setTodos(response);
        setAllTodos(response);
      })
      .catch((err) => {
        console.error('Ошибка сортировки задач:', err);
        setError('Не удалось отсортировать задачи. Пожалуйста, попробуйте еще раз.');
      });
  };

  return {
    onButtonToSorted,
  };
};
