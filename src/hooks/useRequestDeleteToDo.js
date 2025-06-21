import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export const useRequestDeleteToDo = () => {
  const requestDeleteToDo = (id) => {
    const toDoDbRef = ref(db, `todos/${id}`);

    remove(toDoDbRef).then((response) => {
      console.log('todo удален', response);
    });
  };

  return {
    requestDeleteToDo,
  };
};
