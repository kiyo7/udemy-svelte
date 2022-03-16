import {
  collection,
  addDoc,
  query,
  getDocs,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import dayjs from 'dayjs';

export const fetch = async (uid = '') => {
  const q = query(
    collection(db, 'diaries'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  let diaries = [];
  querySnapshot.forEach((doc) => {
    diaries.push({
      id: doc.id,
      body: doc.data().body,
      rate: doc.data().rate,
      image: doc.data().image,
      createdAt: doc.data().createdAt,
    });
  });
  return diaries;
};

export const postDiary = async (uid = '', body = '', rate = 1) => {
  const docRef = await addDoc(collection(db, 'diaries'), {
    uid: uid,
    body: body,
    rate: rate,
    image: '',
    createdAt: dayjs().format('YYYY/MM/DD HH:mm:ss'),
  });
  return docRef.id ? true : false;
};
