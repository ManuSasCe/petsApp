import { HealthStatus } from "../types";

interface HealthBadgeProps {
  status: HealthStatus;
  className?: string;
}

export default function HealthBadge({ status, className }: HealthBadgeProps) {

    const getBadgeClasses = () => {
    switch (status) {
      case "unhealthy":
        return "bg-red-100 text-red-800 border-red-200";
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200";
      case "very-healthy":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getBadgeClasses()} ${className || ""}`}>
      {status === "unhealthy" 
        ? "Unhealthy" 
        : status === "healthy" 
          ? "Healthy" 
          : "Very Healthy"}
    </span>
  );
}