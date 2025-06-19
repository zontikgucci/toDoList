import { useEffect, useState } from 'react';
import styles from './App.module.css';

const URL_TODOS = 'http://localhost:3000/todos';

export const App = () => {
  const [todo, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(URL_TODOS)
      .then((loadedData) => loadedData.json())
      .then((loadedToDos) => setTodos(loadedToDos))
      .catch((error) => alert(error))
      .finally(() => setIsLoading(false));
  }, [refreshProducts]);

  const onChangeInputText = ({ target }) => {
    setTitle(target.value);

    if (target.value.length !== 0) {
      setIsCreating(false);
    } else {
      setIsCreating(true);
    }
  };

  const requestAddToDoKeyDown = ({ key }) => {
    if (key === 'Enter' && title.length !== 0) {
      requestAddToDo(title);
    }
  };

  const requestAddToDo = (title) => {
    fetch(URL_TODOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        title,
        completed: false,
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log('To-Do добавлено', response);
        setTitle('');
        setRefreshProducts(!refreshProducts);
      })
      .finally(() => {
        setIsCreating(true);
      });
  };

  const requestCompletedToDo = (id, title, isCompleted) => {
    fetch(`${URL_TODOS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        title,
        completed: !isCompleted,
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log('To-Do обновлена', response);
        setRefreshProducts(!refreshProducts);
      });
  };

  const requestDeleteToDo = (id) => {
    fetch(`${URL_TODOS}/${id}`, {
      method: 'DELETE',
    })
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        console.log('To-Do Удалена', response);
        setRefreshProducts(!refreshProducts);
      });
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
              value={title}
              className={styles.todoInput}
              onChange={onChangeInputText}
              onKeyDown={requestAddToDoKeyDown}
            />
            <button className={styles.addButton} onClick={() => requestAddToDo(title)} disabled={isCreating}>
              Add
            </button>
          </div>
          <div className={styles.controlsSection}>
            <input type="text" placeholder="Search tasks..." className={styles.searchInput} />
            <button className={styles.sortButton}>Sort</button>
          </div>
          <ul className={styles.todoList}>
            {todo.map(({ id, title, completed }) => (
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
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
