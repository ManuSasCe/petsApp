import { Link, useLocation } from "react-router-dom";
import { Card, Badge } from "flowbite-react";
import { Pet } from "../types";
import { calculatePetHealth } from "../utils/healthUtils";
import HealthBadge from "./HealthBadge";
import { useTranslation } from "react-i18next";

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const location = useLocation();
  const detailUrl = `/pet/${pet.id}${location.search}`;
  const healthStatus = calculatePetHealth(pet);
  const { t } = useTranslation();

  return (
    <Link to={detailUrl} className="block h-full">
      <Card
        className="w-full max-w-xs"
        renderImage={() => (
          <div className="h-56 w-full overflow-hidden">
            <img
              className="size-full object-scale-down"
              src={pet.photo_url}
              alt={`${pet.name} - ${pet.kind}`}
            />
          </div>
        )}
        horizontal={false}
      >
        <div className="flex grow flex-col">
          <div className="mb-2 flex items-center justify-between">
            <h5 className="truncate text-lg font-bold dark:text-gray-400">{pet.name}</h5>
            <Badge
              color="gray"
              className="ml-2 shrink-0 rounded-full capitalize "
            >
              {t(`pet_types.${pet.kind.toLowerCase()}`)}
            </Badge>
          </div>
          <div className="grow space-y-1 text-sm">
            <p className="line-clamp-2 text-gray-400">
              <span className="font-medium">{t("detail.weight")}:</span> {pet.weight} g
            </p>
            <p className="text-gray-700 dark:text-gray-400">
              <span className="font-medium">{t("detail.height")}:</span> {pet.height} cm
            </p>
            <p className="text-gray-700 dark:text-gray-400">
              <span className="font-medium">{t("detail.length")}:</span> {pet.length} cm
            </p>
            <div className="mt-auto">
              <HealthBadge status={healthStatus} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
