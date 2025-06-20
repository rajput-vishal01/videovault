"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  message: string;
  type: NotificationType;
  id: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-900";
      case "error":
        return "bg-red-50 border-red-200 text-red-900";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-900";
      default:
        return "bg-blue-50 border-blue-200 text-blue-900";
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Notification Container */}
      <div className="fixed bottom-4 right-4 z-[1000] space-y-3 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-in slide-in-from-right duration-300 ${getNotificationStyles(
              notification.type
            )}`}>
            <div className="mt-0.5 flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="p-1 rounded-full hover:bg-black/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black/20">
              <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
