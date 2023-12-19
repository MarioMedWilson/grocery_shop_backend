
// import dotenv from "dotenv";
// dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


// var serviceAccount = {
  //     "project_id": process.env.PROJECT_ID,
  //     "private_key_id": process.env.PRIVATE_KEY_ID,
  //     "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  //     "client_email": process.env.CLIENT_EMAIL,
  //     "client_id": process.env.CLIENT_ID_IMAGE,
  //     "auth_uri": process.env.AUTH_URI,
  //     "token_uri": process.env.TOKEN_URI,
  //     "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
  //     "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
  //     "universe_domain": process.env.UNIVERSE_DOMAIN
  // }
  // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   storageBucket: process.env.STORAGE_BUCKET
    // });
    
    // export default admin;
    
import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';

const firebaseConfig = {
  "project_id": process.env.PROJECT_ID,
      "private_key_id": process.env.PRIVATE_KEY_ID,
      "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.CLIENT_EMAIL,
      "client_id": process.env.CLIENT_ID_IMAGE,
      "auth_uri": process.env.AUTH_URI,
      "token_uri": process.env.TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
      "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
      "universe_domain": process.env.UNIVERSE_DOMAIN
};

const firebaseApp = initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    storageBucket: process.env.STORAGE_BUCKET
  });
const storage = getStorage(firebaseApp);
const storageRef = ref(storage);

export default storageRef;