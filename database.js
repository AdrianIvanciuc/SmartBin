// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, push, onValue } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  databaseURL: import.meta.env.VITE_databaseURL,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId
};

//initalize all the stuff we need
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

async function validateEmail(email) { // validates email with those present in db
  const usersRef = ref(database, 'users/');
  try {
    const snapshot = await get(usersRef);
    const data = snapshot.val();
    if (!data) {
      console.log("No users in the database.");
      return true;
    }
    for (let user in data) {
      if (data[user].email == email) {
        console.log("Duplicate email found: ", email);
        return false;
      }
    }
    console.log("Email is unique: ", email);
    return true;
  } catch (error) {
    console.error("Error checking email uniqueness: ", error);
    return false;
  }
}

async function newUser() { // adds new user in db for other operations
  const user = auth.currentUser;
  if (!user) {
    console.error("No user authenticated.");
    return;
  }
  try {
    const usersRef = ref(database, 'users/');
    await push(usersRef, {
      uid: user.uid,
      email: user.email,
      operations: 0,
    });
  } 
  catch (error) {
    console.error(error);
  }
}

async function newCode(code) { // adds qr code to db after gen
  const user = auth.currentUser;
  if (!user) {
    console.error("No user authenticated.");
    return;
  }
  try {
    set(ref(database, 'codes/' + user.uid), {
      code: code
    });
  } 
  catch (error) {
    console.error(error);
  }
}

async function getCode() { // gets scanned qr code for current user
  const user = auth.currentUser;
  if (!user) {
    console.error("No user authenticated.");
    return;
  }
  try {
    const snapshot = await get(ref(database, 'codes/' + user.uid))
    const data = snapshot.val();
    return data.code;
  } 
  catch (error) {
    console.error(error);
  }
}

/* 
onValue listener for smartbin operation that adds a completed operation to users
0. we get the operation code
1. check user generated codes in database
2. if operation code matches a user generated code
3. check user accounts in database
4. if user uid matches user generated code uid
5. we set operations to +1, meaning they completed a succssesful operation
6. we then delete the currently generated code since it was used
*/
onValue(ref(database, '/operation/smartbin1'), () => {
  get(ref(database, '/operation/smartbin1')).then((binSnapshot) => {
    const bin = binSnapshot.val() // 0
    get(ref(database, 'codes/')).then((codesSnapshot) => {
      const codes = codesSnapshot.val();
      for (let uid in codes) { // 1
        if (codes[uid].code == bin.code) { // 2
          get(ref(database, 'users/')).then((usersSnapshot) => {
            const users = usersSnapshot.val();
            for (let entry in users) { // 3
              if (users[entry].uid == uid) { // 4
                try {
                  set(ref(database, 'users/' + entry), { // 5
                    operations: users[entry].operations + 1,
                    email: users[entry].email,
                    uid: users[entry].uid
                  });
                }
                catch (error) {
                  console.error(error);
                  console.log("couldnt update user operations");
                }
                try { // 6
                  set(ref(database, 'codes/' + uid), {
                    code: "none"
                  });
                }
                catch (error) {
                  console.error(error);
                  console.log("couldnt delete user generated code");
                }
                break;
              }
            }
          });
          break;
        }
      }
    });
  });
});

export { app, auth, validateEmail, newUser, newCode, getCode };