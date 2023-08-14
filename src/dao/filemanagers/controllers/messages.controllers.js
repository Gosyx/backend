import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: String,
  message: String,
});

const Message = mongoose.model('Message', messageSchema);

export default class MessageController {
  constructor() {
    // Constructor si es necesario
  }

  async getAllMessages() {
    try {
      const messages = await Message.find();
      return messages;
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
      throw error;
    }
  }

  async addMessage(name, message) {
    try {
      const newMessage = new Message({ name, message });
      await newMessage.save();
      console.log('Mensaje agregado con éxito:', newMessage);
      return newMessage;
    } catch (error) {
      console.error('Error al agregar el mensaje:', error);
      throw error;
    }
  }
}
