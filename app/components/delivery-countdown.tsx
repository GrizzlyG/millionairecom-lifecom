"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface DeliveryCountdownProps {
  deliveryTime: string | null;
}

const DeliveryCountdown: React.FC<DeliveryCountdownProps> = ({ deliveryTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!deliveryTime) {
      setTimeLeft("You can still place order");
      setIsExpired(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(deliveryTime).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(false);
        setTimeLeft("You can still place order");
        return;
      }

      setIsExpired(false);

      const totalMinutes = Math.floor(difference / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (totalMinutes > 0) {
        setTimeLeft(`${totalMinutes} minutes to next free delivery`);
      } else {
        setTimeLeft(`${seconds} seconds to next free delivery`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [deliveryTime]);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
      timeLeft === "You can still place order"
        ? "bg-blue-100 text-blue-700" 
        : "bg-green-100 text-green-700"
    }`}>
      <Clock className="text-lg" />
      <span className="hidden sm:inline">{timeLeft}</span>
      <span className="sm:hidden">
        {timeLeft === "You can still place order" 
          ? "Order now" 
          : timeLeft.replace(" to next free delivery", "")}
      </span>
    </div>
  );
};

export default DeliveryCountdown;
