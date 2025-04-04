const admin = require("firebase-admin");
const serviceAccount = require("../firebase-adminsdk.json"); // Baixe sua chave do Firebase

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
// Agora você pode usar o admin para acessar o Firebase, por exemplo:
// const db = admin.firestore();