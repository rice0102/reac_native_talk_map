import firebase from 'firebase';

export function createMessage(data) {
  const { currentUser } = firebase.auth();
  return firebase.database().ref(`/talkmap/${currentUser.uid}/`)
    .update(data)
    .then((user) => ({ user }))
    .catch((err) => ({ err }));
}

export function fetchMessage(callback) {
  const { currentUser } = firebase.auth();
  const ref = firebase.database().ref(`/talkmap/${currentUser.uid}/`);
  const handler = (snapshot) => {
    callback(snapshot.val());
  };

  ref.on('value', handler);
  return () => {
    ref.off('value', handler);
  };
}
