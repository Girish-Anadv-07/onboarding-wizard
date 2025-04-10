import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const pagesCollection = collection(db, "pages");
const onBoardingSubmissions = collection(db, "submissions");

export const fetchPagesFromFirestore = async () => {
  try {
    const snapshot = await getDocs(pagesCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching pages from Firestore:", error);
    return [];
  }
};

export const addPageToFirestore = async (pageData) => {
  try {
    await setDoc(doc(pagesCollection, pageData.id), pageData);
    return { ...pageData };
  } catch (error) {
    console.error("Error adding page to Firestore:", error);
    return null;
  }
};

export const updatePageInFirestore = async (page) => {
  try {
    const { id, ...data } = page;
    const docRef = doc(pagesCollection, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating page in Firestore:", error);
    return null;
  }
};

export const deletePageFromFirestore = async (pageId) => {
  try {
    const docRef = doc(pagesCollection, pageId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting page from Firestore:", error);
    return null;
  }
};

export const fetchSubmissionByUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(onBoardingSubmissions, userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching submission for user:", error);
    return null;
  }
};

export const saveSubmissionForUser = async (userId, data) => {
  try {
    await setDoc(doc(onBoardingSubmissions, userId), data);
  } catch (error) {
    console.error("Error saving submission for user:", error);
    return null;
  }
};

export const fetchAllSubmissions = async () => {
  try {
    const snapshot = await getDocs(onBoardingSubmissions);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching all submissions:", error);
    return [];
  }
};
