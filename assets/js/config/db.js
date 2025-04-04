import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Conectado ao MongoDB');
        })
        .catch((error) => {
            console.error('Erro ao conectar ao MongoDB', error);
        });
};

export default connectDB; // Certifique-se de exportar como padrão