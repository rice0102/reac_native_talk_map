import _ from 'lodash';
import firebase from 'firebase';

export function signInWithEmailAndPassword(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => ({ user }))
    .catch(() => {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          const name = _.capitalize(email.split('@')[0]);
            return firebase.database().ref(`/talkmap/${user.uid}/userDetail/`)
            .set({ name, email: user.email, photoUrl: '' })
            .then((user2) => ({ user2 }))
            .catch((err) => ({ err }));
        })
        .catch((err) => ({ err }));
    });
}

export function signOut() {
  return firebase.auth().signOut();
}
