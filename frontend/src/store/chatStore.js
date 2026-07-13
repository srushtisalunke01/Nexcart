import { create } from 'zustand';
import api from '../services/api.js';
import io from 'socket.io-client';

export const useChatStore = create((set, get) => ({
  socket: null,
  conversations: [],
  activeConversationId: null,
  activeChatPartner: null,
  messages: [],
  isTyping: false,
  partnerIsTyping: false,
  isLoading: false,

  initSocket: (userId) => {
    if (get().socket) return;

    // Connect to backend root server
    const socketInstance = io(window.location.origin || 'http://localhost:5000');
    
    socketInstance.emit('setup', { id: userId });

    socketInstance.on('message received', (newMessage) => {
      const activeConvoId = get().activeConversationId;
      if (activeConvoId === newMessage.conversationId) {
        set({ messages: [...get().messages, newMessage] });
      }
      
      // Refresh conversations list to update latest text snippet
      get().fetchConversations();
    });

    socketInstance.on('typing', () => set({ partnerIsTyping: true }));
    socketInstance.on('stop typing', () => set({ partnerIsTyping: false }));

    set({ socket: socketInstance });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchConversations: async () => {
    try {
      const response = await api.get('/messages/conversations');
      if (response.data.success) {
        set({ conversations: response.data.conversations });
      }
    } catch (err) {
      console.error('Failed to retrieve chat threads:', err);
    }
  },

  fetchMessages: async (partnerId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/messages/history/${partnerId}`);
      if (response.data.success) {
        // Find correct conversation ID
        const conversationId = response.data.messages[0]?.conversationId || 
          [get().socket?.id || 'temp', partnerId].sort().join('_'); // fallback definition

        set({ 
          messages: response.data.messages, 
          activeConversationId: conversationId,
          isLoading: false 
        });

        // Join room
        get().socket?.emit('join chat', conversationId);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      set({ isLoading: false });
    }
  },

  sendMessage: async (receiverId, text, attachment = '', offerAmount = null, productId = null) => {
    try {
      const response = await api.post('/messages', {
        receiverId,
        text,
        attachment,
        offerAmount,
        productId,
      });

      if (response.data.success) {
        const newMessage = response.data.message;
        set({ messages: [...get().messages, newMessage] });
        
        // Notify socket peers
        get().socket?.emit('new message', newMessage);
        get().socket?.emit('stop typing', newMessage.conversationId);
        
        get().fetchConversations();
        return { success: true, message: newMessage };
      }
    } catch (err) {
      console.error('Error sending message:', err);
      return { success: false };
    }
  },

  respondToOffer: async (messageId, status) => {
    try {
      const response = await api.put(`/messages/offer/${messageId}`, { status });
      if (response.data.success) {
        const updated = response.data.updatedMessage;
        
        // Update local message status
        const updatedMessages = get().messages.map(msg => 
          msg._id === messageId ? { ...msg, offerStatus: status } : msg
        );
        set({ messages: updatedMessages });

        // Notify socket room
        get().socket?.emit('new message', {
          ...updated,
          conversationId: get().activeConversationId
        });

        return { success: true };
      }
    } catch (err) {
      console.error('Error resolving offer:', err);
      return { success: false };
    }
  },

  sendTypingState: (isTyping) => {
    const convoId = get().activeConversationId;
    if (!convoId || !get().socket) return;

    if (isTyping) {
      get().socket.emit('typing', convoId);
    } else {
      get().socket.emit('stop typing', convoId);
    }
  },
}));
