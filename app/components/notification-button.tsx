"use client";

import { useEffect, useState } from "react";
import { requestNotificationPermission, onMessageListener } from "@/libs/firebase-messaging";
import toast from "react-hot-toast";
import { Bell, BellOff } from "lucide-react";

interface NotificationButtonProps {
  userId?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ userId }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Listen for foreground messages
    onMessageListener()
      .then((payload: any) => {
        toast.success(
          payload.notification?.title + "\n" + payload.notification?.body,
          { duration: 5000 }
        );
      })
      .catch((err) => console.log("Failed to listen for messages:", err));
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const token = await requestNotificationPermission();
      
      if (token && userId) {
        // Save token to database
        const response = await fetch("/api/notifications/register-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, userId }),
        });

        if (response.ok) {
          setPermission("granted");
          toast.success("Notifications enabled! You'll receive updates on your device.");
        } else {
          toast.error("Failed to register for notifications");
        }
      } else if (!token) {
        toast.error("Please allow notifications in your browser settings");
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      toast.error("Failed to enable notifications");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  if (permission === "granted") {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600">
        <Bell size={18} />
        <span className="hidden sm:inline">Notifications enabled</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnableNotifications}
      disabled={isLoading || permission === "denied"}
      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white text-sm rounded-lg transition"
    >
      {permission === "denied" ? (
        <>
          <BellOff size={18} />
          <span className="hidden sm:inline">Blocked</span>
        </>
      ) : (
        <>
          <Bell size={18} />
          <span className="hidden sm:inline">
            {isLoading ? "Enabling..." : "Enable Notifications"}
          </span>
        </>
      )}
    </button>
  );
};

export default NotificationButton;
