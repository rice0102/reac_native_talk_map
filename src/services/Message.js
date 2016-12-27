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

//=========================chat=============================================
export function fetchUserDetail(callback) {
  const { currentUser } = firebase.auth();
  const ref = firebase.database().ref(`/talkmap/${currentUser.uid}/userDetail`);
  const handler = (snapshot) => {
    callback(snapshot.val());
  };

  ref.on('value', handler);
  return () => {
    ref.off('value', handler);
  };
}

export function roomOpen(data) {
  const uid = firebase.auth().currentUser.uid;
  const id = data.uid;
  if (uid === id) return 'Me';
  const roomNameArray = [uid, id];
  const roomName = roomNameArray.sort().toString();
  return { roomName, data };
}

export function updateChatMessage(message) {
  const { Messages, roomName } = message;
  return firebase.database().ref(`/chats/${roomName}/`)
    .push(Messages)
    .then((user) => ({ user, roomName }))
    .catch((err) => ({ err }));
}

export function fetchChatMessage(room, callback) {
  const ref = firebase.database().ref(`/chats/${room}`);
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

export function fetchChats(room) {
  return fetch(`chats/${room}`);
}
