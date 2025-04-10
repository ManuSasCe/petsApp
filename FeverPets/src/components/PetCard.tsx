import { Link, useLocation } from "react-router-dom";
import { Card, Badge } from "flowbite-react";
import { Pet } from "../types";
import { calculatePetHealth } from "../utils/healthUtils";
import HealthBadge from "./HealthBadge";

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const location = useLocation();
  const detailUrl = `/pet/${pet.id}${location.search}`;
  const healthStatus = calculatePetHealth(pet);

  return (
    <Link to={detailUrl} className="block h-full">
      <Card
        className="h-full transition-shadow hover:shadow-lg  "
        renderImage={() => (
          <div className="h-56 w-full overflow-hidden">
            <img
              className="size-full object-cover"
              src={pet.photo_url}
              alt={`${pet.name} - ${pet.kind}`}
            />
          </div>
        )}
        horizontal={false}
      >
        <div className="flex items-start justify-between">
          <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {pet.name}
          </h5>
          <Badge color="gray" className="capitalize">
            {pet.kind}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-400">
            <span className="font-medium">Weight:</span> {pet.weight} g
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            <span className="font-medium">Height:</span> {pet.height} cm
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            <span className="font-medium">Length:</span> {pet.length} cm
          </p>
        </div>
        <div className="mt-3">
          <HealthBadge status={healthStatus} />
        </div>
      </Card>
    </Link>
  );
}
