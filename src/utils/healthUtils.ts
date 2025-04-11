import { Pet, HealthStatus } from "../types";

export function calculatePetHealth(pet: Pet): HealthStatus {
  // For cats with 1 life, they are always unhealthy =(
  if (pet.kind.toLowerCase() === "cat" && pet.number_of_lives === 1) {
    return "unhealthy";
  }

  const healthRatio = pet.weight / (pet.height * pet.length);

  // Determine health status based on the ratio
  if (healthRatio < 2 || healthRatio > 5) {
    return "unhealthy";
  } else if (healthRatio >= 3 && healthRatio <= 5) {
    return "healthy";
  } else {
    return "very-healthy"; // Between 2 and 3
  }
}

export function getHealthStatusLabel(status: HealthStatus): string {
  switch (status) {
    case "unhealthy":
      return "Unhealthy";
    case "healthy":
      return "Healthy";
    case "very-healthy":
      return "Very Healthy";
    default:
      return "Unknown";
  }
}

export function getHealthColor(status: HealthStatus): string {
  switch (status) {
    case "unhealthy":
      return "bg-health-unhealthy";
    case "healthy":
      return "bg-health-healthy";
    case "very-healthy":
      return "bg-health-very-healthy";
    default:
      return "bg-gray-200";
  }
}