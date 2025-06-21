import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

export const useRequestAddToDo = ({ setTitleToDo }) => {
  const [isCreating, setIsCreating] = useState(true);

  const requestAddToDo = (title) => {
    const toDoDbRef = ref(db, 'todos');

    push(toDoDbRef, {
      title,
      completed: false,
    })
      .then((response) => {
        setTitleToDo('');
        console.log('todo добавлен', response);
      })
      .finally(() => setIsCreating(false));
  };

  return {
    isCreating,
    setIsCreating,
    requestAddToDo,
  };
};
