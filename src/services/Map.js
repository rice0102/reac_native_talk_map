import firebase from 'firebase';

export function fetchMarkers(callback) {
  const ref = firebase.database().ref('/talkmap/');
  const handler = (snapshot) => {
    callback(snapshot.val());
  };
  ref.on('value', handler);
  return () => {
    ref.off('value', handler);
  };
}

export function updatePosistion(data) {
  const { currentUser } = firebase.auth();
  return firebase.database().ref(`/talkmap/${currentUser.uid}/latlon`)
    .set(data)
    .then((user) => ({ user }))
    .catch((err) => ({ err }));
}
