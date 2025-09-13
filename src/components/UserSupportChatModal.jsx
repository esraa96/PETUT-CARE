import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { RiCloseLine, RiSendPlaneFill, RiUserLine, RiAdminLine } from 'react-icons/ri';

export default function UserSupportChatModal({ ticket, onClose }) {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!ticket?.id) return;

    const unsubscribe = onSnapshot(doc(db, 'support_tickets', ticket.id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setMessages(data.messages || []);
        
        // Mark as seen when user opens the chat
        if (user) {
          updateDoc(doc.ref, {
            userLastSeen: new Date()
          }).catch(console.error);
        }
      }
    });

    return () => unsubscribe();
  }, [ticket?.id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !ticket?.id) {
      toast.error('Unable to send message. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const messageData = {
        senderId: user.uid,
        senderName: user.displayName || user.email || 'User',
        message: newMessage.trim(),
        timestamp: new Date(),
        isAdmin: false
      };

      const ticketRef = doc(db, 'support_tickets', ticket.id);
      await updateDoc(ticketRef, {
        messages: arrayUnion(messageData),
        updatedAt: new Date(),
        status: ticket.status === 'resolved' ? 'open' : ticket.status
      });

      setNewMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.code === 'permission-denied') {
        toast.error('You do not have permission to send messages to this ticket');
      } else if (error.code === 'not-found') {
        toast.error('Ticket not found. Please refresh the page');
      } else {
        toast.error('Failed to send message. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-petut-brown-50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {ticket.subject}
            </h3>
            <p className="text-sm text-petut-brown-600">
              Status: {getStatusText(ticket.status)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                    message.isAdmin
                      ? 'bg-white text-gray-900 border border-gray-200'
                      : 'bg-petut-brown-300 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.isAdmin ? (
                      <RiAdminLine size={16} className="text-petut-brown-300" />
                    ) : (
                      <RiUserLine size={16} className="text-white" />
                    )}
                    <span className={`text-xs font-medium ${
                      message.isAdmin ? 'text-petut-brown-300' : 'text-white opacity-90'
                    }`}>
                      {message.isAdmin ? 'Support Team' : 'You'}
                    </span>
                    <span className={`text-xs ${
                      message.isAdmin ? 'text-gray-500' : 'text-white opacity-75'
                    }`}>
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {ticket.status !== 'closed' && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={sendMessage} className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="bg-petut-brown-300 text-white px-6 py-3 rounded-lg hover:bg-petut-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <RiSendPlaneFill />
                      Send
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Press Enter to send message
              </p>
            </form>
          </div>
        )}

        {ticket.status === 'closed' && (
          <div className="p-4 border-t border-gray-200 text-center text-gray-500 bg-gray-50">
            <p className="font-medium">This ticket has been closed</p>
            <p className="text-sm">No new messages can be added</p>
          </div>
        )}
      </div>
    </div>
  );
}