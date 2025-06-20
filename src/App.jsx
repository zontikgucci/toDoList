import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './App.module.css';
import { debounce } from './utils/debounce';

const URL_TODOS = 'http://localhost:3000/todos';

export const App = () => {
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [titleToDo, setTitleToDo] = useState('');
  const [isCreating, setIsCreating] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState(null);

  const debouncedSetTodosRef = useRef(debounce(setTodos, 500));

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(URL_TODOS)
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
  }, [refreshProducts]);

  const onSearchToDo = useCallback(
    ({ target }) => {
      const searchValue = target.value.trim();
      setSearchInput(searchValue);

      if (searchValue === '') {
        debouncedSetTodosRef.current(allTodos);
      } else {
        const filteredTodos = allTodos.filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()));
        debouncedSetTodosRef.current(filteredTodos);
      }
    },
    [allTodos],
  );

  const onChangeInputText = ({ target }) => {
    setTitleToDo(target.value);
    setIsCreating(target.value.length === 0);
  };

  const requestAddToDoKeyDown = ({ key }) => {
    if (key === 'Enter' && titleToDo.length !== 0) {
      requestAddToDo(titleToDo);
    }
  };

  const requestAddToDo = (title) => {
    setError(null);
    fetch(URL_TODOS, {
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
        setRefreshProducts((prev) => !prev);
      })
      .catch((err) => {
        console.error('Ошибка добавления задачи:', err);
        setError('Не удалось добавить задачу. Пожалуйста, попробуйте еще раз.');
      })
      .finally(() => setIsCreating(true));
  };

  const requestCompletedToDo = (id, title, isCompleted) => {
    setError(null);
    fetch(`${URL_TODOS}/${id}`, {
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
      .then(() => setRefreshProducts((prev) => !prev))
      .catch((err) => {
        console.error('Ошибка обновления задачи:', err);
        setError('Не удалось обновить статус задачи. Пожалуйста, попробуйте еще раз.');
      });
  };

  const requestDeleteToDo = (id) => {
    setError(null);
    fetch(`${URL_TODOS}/${id}`, {
      method: 'DELETE',
    })
      .then((rawResponse) => {
        if (!rawResponse.ok) {
          throw new Error(`HTTP error! status: ${rawResponse.status}`);
        }
      })
      .then(() => setRefreshProducts((prev) => !prev))
      .catch((err) => {
        console.error('Ошибка удаления задачи:', err);
        setError('Не удалось удалить задачу. Пожалуйста, попробуйте еще раз.');
      });
  };

  const onButtonToSorted = () => {
    setError(null);
    fetch(`${URL_TODOS}?_sort=title`)
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

  return (
    <>
      {isLoading ? (
        <span className={styles.loading}></span>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>To-Do List</h1>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.inputSection}>
            <input
              type="text"
              placeholder="Add a new task..."
              value={titleToDo}
              className={styles.todoInput}
              onChange={onChangeInputText}
              onKeyDown={requestAddToDoKeyDown}
            />
            <button className={styles.addButton} onClick={() => requestAddToDo(titleToDo)} disabled={isCreating}>
              Add
            </button>
          </div>
          <div className={styles.controlsSection}>
            <input
              type="text"
              placeholder="Search tasks..."
              className={styles.searchInput}
              value={searchInput}
              onChange={onSearchToDo}
            />
            <button className={styles.sortButton} onClick={onButtonToSorted}>
              Sort
            </button>
          </div>
          <ul className={styles.todoList}>
            {todos.length === 0 && !isLoading && !error ? (
              <li className={styles.noTasksMessage}>Задачи не найдены.</li>
            ) : (
              todos.map(({ id, title, completed }) => (
                <li className={`${styles.todoItem} ${completed ? styles.completed : ''}`} key={id}>
                  <span className={styles.todoText}>{title}</span>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionButton} ${styles.completeButton}`}
                      onClick={() => requestCompletedToDo(id, title, completed)}
                    >
                      Complete
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => requestDeleteToDo(id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </>
  );
};
