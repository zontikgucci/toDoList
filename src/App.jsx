import { useState, useRef, useCallback } from 'react';
import styles from './App.module.css';
import { debounce } from './utils/debounce';
import {
  useRequestGetToDo,
  useRequestAddToDo,
  useRequestUpdateToDo,
  useRequestDeleteToDo,
  useRequestSortToDo,
} from './hooks';

const URL_TODOS = import.meta.env.VITE_APP_URL;

export const App = () => {
  const [error, setError] = useState(null);
  const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [titleToDo, setTitleToDo] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // request
  const { isLoading, todos, allTodos, setTodos, setAllTodos } = useRequestGetToDo({
    URL_TODOS,
    triggerRefetch,
    setError,
  });
  const { isCreating, setIsCreating, requestAddToDo } = useRequestAddToDo({
    URL_TODOS,
    setTriggerRefetch,
    setError,
    setTitleToDo,
  });
  const { requestCompletedToDo } = useRequestUpdateToDo({ URL_TODOS, setTriggerRefetch, setError });
  const { requestDeleteToDo } = useRequestDeleteToDo({ URL_TODOS, setTriggerRefetch, setError });
  const { onButtonToSorted } = useRequestSortToDo({ URL_TODOS, setError, setTodos, setAllTodos });

  const debouncedSetTodosRef = useRef(debounce(setTodos, 500));
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
