import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ContactAdmin = () => {
  const [messages, setMessages] = useState([]);

  // ✅ Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  // ✅ Delete message
  const deleteMessage = async (id) => {
    try {
      await fetch(`/api/admin/contact?id=${id}`, {
        method: "DELETE",
      });
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // ✅ Toggle read/unread
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "read" ? "unread" : "read";

      await fetch("/api/admin/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      toast.success("Status updated");
      fetchMessages();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">
        Contact Messages
      </h1>

      {messages.length === 0 && (
        <p className="text-gray-500">No messages found</p>
      )}

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`bg-white shadow p-4 rounded-lg border-l-4 
            ${msg.status === "unread" ? "border-pink-500" : "border-gray-300"}`}
          >
            <p><strong>Name:</strong> {msg.name}</p>
            <p><strong>Email:</strong> {msg.email}</p>
            <p><strong>Message:</strong> {msg.message}</p>

            <div className="flex space-x-3 mt-3">
              {/* Toggle */}
              <button
                onClick={() => toggleStatus(msg._id, msg.status)}
                className={`px-3 py-1 rounded text-white ${
                  msg.status === "unread"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              >
                {msg.status === "unread"
                  ? "Mark as Read"
                  : "Mark as Unread"}
              </button>

              {/* Delete */}
              <button
                onClick={() => deleteMessage(msg._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactAdmin;