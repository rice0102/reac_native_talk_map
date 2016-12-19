import firebase from 'firebase';

export function fetchMarkers(callback) {
 // const { currentUser } = firebase.auth();
  const ref = firebase.database().ref('/users/map/');
  const handler = (snapshot) => {
    callback(snapshot.val());
  };
  ref.on('value', handler);
  return () => {
    ref.off('value', handler);
  };
}
