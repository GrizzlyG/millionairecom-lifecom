"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const AdminNotifications = () => {
  const [count, setCount] = useState<number>(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchUnread = async () => {
    try {
      const res = await fetch("/api/notifications/unread");
      if (!res.ok) return;
      const json = await res.json();
      setCount(Array.isArray(json) ? json.length : 0);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUnread();

    // Connect to SSE stream
    const connectSSE = () => {
      const eventSource = new EventSource("/api/admin/notifications/stream");
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log("SSE connection established");
      };

      eventSource.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === "connected") {
            console.log("Connected to notification stream");
          } else if (message.type === "notification") {
            // New notification received - just refresh count, don't show toast for admin
            // Refresh unread count
            fetchUnread();
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        eventSource.close();
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current === eventSource) {
            connectSSE();
          }
        }, 5000);
      };
    };

    connectSSE();

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Link href="/admin/manage-orders" className="relative">
        <Bell size={22} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    </div>
  );
};

export default AdminNotifications;
