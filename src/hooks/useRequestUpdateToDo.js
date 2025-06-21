import { ref, set } from 'firebase/database';
import { db } from '../firebase';

export const useRequestUpdateToDo = () => {
  const requestCompletedToDo = (id, title, isCompleted) => {
    const toDoDbRef = ref(db, `todos/${id}`);

    set(toDoDbRef, {
      title,
      completed: !isCompleted,
    }).then((response) => {
      console.log('todo обновлен', response);
    });
  };

  return {
    requestCompletedToDo,
  };
};
