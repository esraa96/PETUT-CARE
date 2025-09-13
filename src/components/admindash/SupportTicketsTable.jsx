import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import {
  RiEyeLine,
  RiMessage3Line,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";
import SupportChatModal from "./SupportChatModal";

export default function SupportTicketsTable() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 10000);

    const q = query(
      collection(db, "support_tickets"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        clearTimeout(timeoutId);
        const ticketsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(ticketsData);
        setLoading(false);
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error("Error fetching support tickets:", error);
        toast.error("Error loading support tickets");
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await updateDoc(doc(db, "support_tickets", ticketId), {
        status: newStatus,
        updatedAt: new Date(),
      });
      toast.success("Ticket status updated successfully");
    } catch (error) {
      toast.error("Error updating ticket status");
      console.error(error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-blue-600 bg-blue-100";
      case "in_progress":
        return "text-yellow-600 bg-yellow-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      case "closed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    return ticket.status === filter;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return (
      date.toLocaleDateString("ar-EG") +
      " " +
      date.toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petut-brown-300"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
      <div className="flex justify-between items-center mb-6 p-6 pb-0">
        <h2 className="text-2xl font-bold text-black dark:text-white">Support Tickets</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        >
          <option value="all">All Tickets</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="p-6 pt-0">
        {/* Desktop / Tablet */}
        <div className="hidden md:block overflow-x-auto">
          <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto border border-gray-100 dark:border-gray-600 rounded-md">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    User
                  </th>
                  <th className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </th>
                  <th className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </th>
                  <th className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {ticket.userImage ? (
                          <img
                            src={ticket.userImage}
                            alt={ticket.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                            <RiUserLine
                              className="text-black"
                              size={20}
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-black dark:text-white flex items-center gap-2">
                            {ticket.userName}
                            {ticket.hasUnreadMessages && (
                              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {ticket.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-black dark:text-white">{ticket.subject}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority === "urgent"
                          ? "Urgent"
                          : ticket.priority === "high"
                          ? "High"
                          : ticket.priority === "medium"
                          ? "Medium"
                          : "Low"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          updateTicketStatus(ticket.id, e.target.value)
                        }
                        className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <RiTimeLine />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowChatModal(true);
                          }}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                            ticket.hasUnreadMessages
                              ? "bg-petut-brown-400 text-white hover:bg-petut-brown-500"
                              : "bg-petut-brown-300 text-white hover:bg-petut-brown-400"
                          }`}
                        >
                          {ticket.hasUnreadMessages ? (
                            <>
                              <span>New Reply</span>
                            </>
                          ) : (
                            <span>Open Chat</span>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile */}
        <div className="block md:hidden space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 space-y-2"
            >
              <div className="flex items-center gap-3">
                {ticket.userImage ? (
                  <img
                    src={ticket.userImage}
                    alt={ticket.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-petut-brown-200 rounded-full flex items-center justify-center">
                    <RiUserLine className="text-petut-brown-600" size={20} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{ticket.userName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{ticket.userEmail}</p>
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-900 dark:text-white">Subject:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{ticket.subject}</p>
              </div>

              <div className="flex justify-between">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <RiTimeLine />
                {formatDate(ticket.createdAt)}
              </div>

              <button
                onClick={() => {
                  setSelectedTicket(ticket);
                  setShowChatModal(true);
                }}
                className="w-full px-4 py-2 mt-2 rounded-lg text-sm font-medium bg-petut-brown-300 text-white hover:bg-petut-brown-400"
              >
                <RiMessage3Line className="inline-block mr-2" />
                {ticket.hasUnreadMessages ? "New Reply" : "Open Chat"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showChatModal && selectedTicket && (
        <SupportChatModal
          ticket={selectedTicket}
          onClose={() => {
            setShowChatModal(false);
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
}
