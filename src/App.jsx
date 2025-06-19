import styles from './App.module.css';

export const App = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>To-Do List</h1>
      <div className={styles.inputSection}>
        <input type="text" placeholder="Add a new task..." className={styles.todoInput} />
        <button className={styles.addButton}>Add</button>
      </div>
      <div className={styles.controlsSection}>
        <input type="text" placeholder="Search tasks..." className={styles.searchInput} />
        <button className={styles.sortButton}>Sort</button>
      </div>
      <ul className={styles.todoList}>
        <li className={`${styles.todoItem} ${styles.completed}`}>
          <span className={styles.todoText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore consequatur vel nostrum explicabo commodi
            nemo mollitia rem beatae dicta. Sit sunt enim vero vel recusandae dignissimos perferendis quam eveniet
            blanditiis.
          </span>
          <div className={styles.actions}>
            <button className={`${styles.actionButton} ${styles.completeButton}`}>Complete</button>
            <button className={`${styles.actionButton} ${styles.deleteButton}`}>Delete</button>
          </div>
        </li>
      </ul>
    </div>
  );
};
