import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCPewA4yjVNYbrA_5mFRja2RLM-5JPoqPA',
  authDomain: 'to-do-list-ea181.firebaseapp.com',
  projectId: 'to-do-list-ea181',
  storageBucket: 'to-do-list-ea181.firebasestorage.app',
  messagingSenderId: '518347047831',
  appId: '1:518347047831:web:d5da19bcb508ff3b91fad2',
  databaseURL: 'https://to-do-list-ea181-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
