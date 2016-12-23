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

export function loadChatMessage(id) {
  const uid = firebase.auth().currentUser.uid;
  return fetch(`chat/${uid}/${id.uid}`);
}

//=========================chat=============================================

export function roomOpen(data) {
  const uid = firebase.auth().currentUser.uid;
  const id = data.uid;
  if (uid === id) return 'Me';
  const roomNameArray = [uid, id];
  const roomName = roomNameArray.sort().toString();
  return { roomName, data };
}

export function updateChatMessage2(message) {
  const { Messages, roomName } = message;
  return firebase.database().ref(`/chats/${roomName}/`)
    .push(Messages)
    .then((user) => ({ user, roomName }))
    .catch((err) => ({ err }));
}

export function fetchChatMessage(id, callback) {
  const uid = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref(`/chat/${uid}/${id}`);
  const handler = (snapshot) => {
    callback(snapshot.val());
  };

  ref.on('value', handler);
  return () => {
    ref.off('value', handler);
  };
}

function fetch(child) {
  return new Promise((resolve, reject) => {
    firebase.database().ref(child).on('value', snapshot => {
      const val = snapshot.val();
      if (val) {
        resolve(val);
      } else {
        setTimeout(() => {
          fetch(child).then(val => resolve(val));
        }, 500);
      }
    }, reject);
  });
}
