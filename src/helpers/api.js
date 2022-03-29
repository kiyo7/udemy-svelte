import {
  collection,
  doc,
  getDoc,
  addDoc,
  query,
  getDocs,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  limit,
} from 'firebase/firestore';
import { db, storage } from './firebase';
import dayjs from 'dayjs';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

export const fetch = async (uid = '', filterMonth = null) => {
  let q;
  if (filterMonth) {
    filterMonth = filterMonth.replace('-', '/');
    q = query(
      collection(db, 'diaries'),
      where('uid', '==', uid),
      where('createdAt', '>=', `${filterMonth}/01`),
      where('createdAt', '<=', `${filterMonth}/31`),
      limit(31)
    );
  } else {
    q = query(
      collection(db, 'diaries'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(31)
    );
  }
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

export const postDiary = async (
  uid = '',
  body = '',
  rate = 1,
  image = null
) => {
  let uploadResult = '';
  if (image) {
    const storageRef = ref(storage);
    const ext = image.name.split('.').pop(); //拡張子を取得
    const hashName = Math.random().toString(36).slice(-8);
    const uploadRef = ref(storageRef, `/images/${hashName}.${ext}`);
    await uploadBytes(uploadRef, image).then(async function (result) {
      console.log(result);
      console.log('Uploaded a blob or file!');
      await getDownloadURL(uploadRef).then(function (url) {
        uploadResult = url;
      });
    });
  }

  const docRef = await addDoc(collection(db, 'diaries'), {
    uid: uid,
    body: body,
    rate: rate,
    image: uploadResult,
    createdAt: dayjs().format('YYYY/MM/DD HH:mm:ss'),
  });
  return docRef.id ? true : false;
};

export const getDiary = async (id = 'test') => {
  const diary = doc(db, 'diaries', id);
  const docSnap = await getDoc(diary);

  if (docSnap.exists()) {
    console.log('Document data', docSnap.data());
    return docSnap.data();
  } else {
    console.log('No Such document!');
    return false;
  }
};

export const updateDiary = async (
  id = '',
  body = '',
  rate = 1,
  image = null
) => {
  let uploadResult = '';
  if (image) {
    const storageRef = ref(storage);
    const ext = image.name.split('.').pop(); //拡張子を取得
    const hashName = Math.random().toString(36).slice(-8);
    const uploadRef = ref(storageRef, `/images/${hashName}.${ext}`);
    await uploadBytes(uploadRef, image).then(async function (result) {
      console.log(result);
      console.log('Uploaded a blob or file!');
      await getDownloadURL(uploadRef).then(function (url) {
        uploadResult = url;
      });
    });
  }

  const diaryRef = doc(db, 'diaries', id);
  if (!diaryRef) {
    return false;
  }
  let updateData;
  if (image.name) {
    updateData = {
      body: body,
      rate: rate,
      image: uploadResult,
    };
  } else {
    updateData = {
      body: body,
      rate: rate,
    };
  }
  await updateDoc(diaryRef, updateData);
  return true;
};

export const deleteDiary = async (id) => {
  if (!id) {
    return false;
  }
  await deleteDoc(doc(db, 'diaries', id));
  return true;
};
