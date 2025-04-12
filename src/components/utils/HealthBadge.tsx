import { HealthStatus } from "../../types";
import { getHealthColor, getHealthStatusLabel } from "../../utils/HealthUtils";

interface HealthBadgeProps {
  status: HealthStatus;
  className?: string;
}

export default function HealthBadge({ status, className }: HealthBadgeProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getHealthColor(status)} ${className || ""}`}
    >
      {status === "unhealthy"
        ? getHealthStatusLabel("unhealthy")
        : status === "healthy"
          ? getHealthStatusLabel("healthy")
          : getHealthStatusLabel("very-healthy")}
    </span>
  );
}
