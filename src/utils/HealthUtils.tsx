import { Pet, HealthStatus } from "../types";
import i18n from "../i18n";

// For cats with 1 life, they are always unhealthy =(
export function calculatePetHealth(pet: Pet): HealthStatus {
  if (pet.kind === "cat") {
    if (pet.number_of_lives === 1) {
      return "unhealthy"; // Cats with 1 life rule
    }
  }
  const healthRatio = pet.weight / (pet.height * pet.length);
  if (healthRatio < 2 || healthRatio > 5) {
    return "unhealthy";
  } else if (healthRatio >= 3 && healthRatio <= 5) {
    return "healthy";
  } else {
    return "very-healthy";
  }
}

export function getHealthStatusLabel(status: HealthStatus): string {
  switch (status) {
    case "unhealthy":
      return i18n.t("health_status.unhealthy");
    case "healthy":
      return i18n.t("health_status.healthy");
    case "very-healthy":
      return i18n.t("health_status.very_healthy");
    default:
      return i18n.t("health_status.unknown");
  }
}

export function getHealthColor(status: HealthStatus): string {
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
}
