import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const postDiary = async (uid = '', body = '', rate = 1) => {
  const docRef = await addDoc(collection(db, 'diaries'), {
    uid: uid,
    body: body,
    rate: rate,
    img: '',
    createdAt: serverTimestamp(),
  });
  console.log('Document written with ID: ', docRef.id);
  return docRef.id ? true : false;
};
