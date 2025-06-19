import { useEffect, useState } from 'react';
import styles from './App.module.css';

export const App = () => {
  const [todo, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => response.json())
      .then((responseTodo) => setTodos(responseTodo))
      .catch((error) => alert(error))
      .finally(setIsLoading(false));
  }, []);

  return (
    <>
      {isLoading ? (
        <span className={styles.loading}></span>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>To-Do List</h1>
          {/* <div className={styles.inputSection}>
            <input type="text" placeholder="Add a new task..." className={styles.todoInput} />
            <button className={styles.addButton}>Add</button>
          </div>
          <div className={styles.controlsSection}>
            <input type="text" placeholder="Search tasks..." className={styles.searchInput} />
            <button className={styles.sortButton}>Sort</button>
          </div> */}
          <ul className={styles.todoList}>
            {[todo].map(({ id, title, completed }) => (
              <li className={`${styles.todoItem} ${completed ? styles.completed : ''}`} key={id}>
                <span className={styles.todoText}>{title}</span>
                <div className={styles.actions}>
                  <button className={`${styles.actionButton} ${styles.completeButton}`}>Complete</button>
                  <button className={`${styles.actionButton} ${styles.deleteButton}`}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
