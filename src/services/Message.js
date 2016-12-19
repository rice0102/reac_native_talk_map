import firebase from 'firebase';

export function createMessage(message) {
  const { currentUser } = firebase.auth();
  return firebase.database().ref(`/users/map/${currentUser.uid}/`)
    .set(message)
    .then((user) => ({ user }))
    .catch((err) => ({ err }));
}

export function fetchMessage(callback) {
  const { currentUser } = firebase.auth();
  const ref = firebase.database().ref(`/users/map/${currentUser.uid}/`);
  const handler = (snapshot) => {
    callback(snapshot.val());
  };

  ref.on('value', handler);
  return () => {
    ref.off('value', handler);
  };
}
