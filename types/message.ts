import firebase from 'firebase/app';

export type Message = {
  text: string;
  createdAt: FirebaseFirestore.Timestamp;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
};
