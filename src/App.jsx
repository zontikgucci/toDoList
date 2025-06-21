import { useState, useMemo } from 'react';
import styles from './App.module.css';
import { useRequestGetToDo, useRequestAddToDo, useRequestUpdateToDo, useRequestDeleteToDo } from './hooks';

export const App = () => {
  const [titleToDo, setTitleToDo] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSorted, setIsSorted] = useState(false);

  // request
  const { isLoading, todos } = useRequestGetToDo();
  const { isCreating, setIsCreating, requestAddToDo } = useRequestAddToDo({ setTitleToDo });
  const { requestCompletedToDo } = useRequestUpdateToDo();
  const { requestDeleteToDo } = useRequestDeleteToDo();

  const displayedTodos = useMemo(() => {
    const filteredTodos = todos.filter(({ title }) => title.toLowerCase().includes(searchInput.toLowerCase()));

    if (isSorted) {
      return [...filteredTodos].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filteredTodos;
  }, [todos, searchInput, isSorted]);
  console.log(displayedTodos);

  const onChangeInputText = ({ target }) => {
    setTitleToDo(target.value);
    setIsCreating(target.value.length === 0);
  };

  const requestAddToDoKeyDown = ({ key }) => {
    if (key === 'Enter' && titleToDo.length !== 0) {
      requestAddToDo(titleToDo);
    }
  };

  const onButtonToSort = () => {
    setIsSorted((prev) => !prev);
  };

  return (
    <>
      {isLoading ? (
        <span className={styles.loading}></span>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>To-Do List</h1>
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
              onChange={({ target }) => setSearchInput(target.value)}
            />
            <button className={styles.sortButton} onClick={onButtonToSort}>
              {isSorted ? 'Undo' : 'Sort'}
            </button>
          </div>
          <ul className={styles.todoList}>
            {displayedTodos.length === 0 && !isLoading ? (
              <li className={styles.noTasksMessage}>Задачи не найдены.</li>
            ) : (
              displayedTodos.map(({ id, title, completed }) => (
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
