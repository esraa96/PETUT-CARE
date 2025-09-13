import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { RiCloseLine, RiSendPlaneFill, RiUserLine, RiAdminLine } from 'react-icons/ri';

export default function SupportChatModal({ ticket, onClose }) {
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
      }
    });

    return () => unsubscribe();
  }, [ticket?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const messageData = {
        senderId: user.uid,
        senderName: user.displayName || 'Admin',
        message: newMessage.trim(),
        timestamp: new Date(),
        isAdmin: true,
        senderRole: 'admin'
      };

      await updateDoc(doc(db, 'support_tickets', ticket.id), {
        messages: arrayUnion(messageData),
        updatedAt: new Date(),
        status: 'in_progress',
        hasUnreadMessages: true
      });

      setNewMessage('');
      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error('Error sending message');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-800 w-full h-full sm:rounded-lg sm:shadow-xl sm:w-full sm:max-w-2xl sm:h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {ticket.subject}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              with {ticket.userName} ({ticket.userEmail})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-sm ${
                    message.isAdmin
                      ? 'bg-petut-brown-300 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.isAdmin ? (
                      <RiAdminLine size={16} className="text-white" />
                    ) : (
                      <RiUserLine size={16} className="text-petut-brown-300 dark:text-petut-brown-400" />
                    )}
                    <span className={`text-xs font-medium ${
                      message.isAdmin ? 'text-white opacity-90' : 'text-petut-brown-300 dark:text-petut-brown-400'
                    }`}>
                      {message.senderName}
                    </span>
                    <span className={`text-xs ${
                      message.isAdmin ? 'text-white opacity-75' : 'text-gray-500 dark:text-gray-400'
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
        <div className="p-2 sm:p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
          <form onSubmit={sendMessage} className="space-y-2 sm:space-y-3">
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-petut-brown-300 focus:border-petut-brown-300 transition-colors text-sm sm:text-base"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="bg-petut-brown-300 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-petut-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 font-medium text-sm sm:text-base"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <RiSendPlaneFill />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Press Enter to send message or use the Send button
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}