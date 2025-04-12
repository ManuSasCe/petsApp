import { Card, Badge, Spinner } from "flowbite-react";
import { CalendarEdit } from "flowbite-react-icons/outline";
import { Link } from "react-router-dom";
import { calculatePetHealth } from "../utils/healthUtils";
import HealthBadge from "./HealthBadge";
import { usePetOfTheDay } from "../utils/petOfDayUtils";
import { Pet } from "../types";
import { useTranslation } from "react-i18next";

export default function PetOfDay({ allPets }: { allPets: Pet[] }) {
  const petOfTheDay = usePetOfTheDay(allPets);
  const { t } = useTranslation();

  if (!allPets.length) return (
    <p>{t("pet_day.error")}</p>
  );

  if (!petOfTheDay) {
    return (
      <Card className="animate-pulse text-center">
        <div className="flex items-center justify-center">
          <CalendarEdit className="mr-2 size-5" />
          <h5 className="text-lg font-medium">{t("pet_day.title")}</h5>
        </div>
        <div className="flex h-40 items-center justify-center">
          <Spinner aria-label={t("pet_day.loading")} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center">
          <CalendarEdit className="mr-2 size-5" />
          <h5 className="text-lg font-medium">{t("pet_day.title")}</h5>
        </div>

        <Link to={`/pet/${petOfTheDay.id}`} className="block">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="h-40 w-full overflow-hidden rounded-lg md:w-1/3">
              <img
                src={petOfTheDay.photo_url}
                alt={petOfTheDay.name}
                className="size-full object-cover transition-transform hover:scale-105"
              />
            </div>

            <div className="w-full space-y-2 text-left md:w-2/3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {petOfTheDay.name}
                </h3>
                <div className="flex flex-row space-x-2">
                    {petOfTheDay && (
                    <HealthBadge status={calculatePetHealth(petOfTheDay)} />
                    )}
                <Badge color="gray" className="capitalize">
                  {petOfTheDay.kind}
                </Badge>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t("detail.weight")}:</span>{" "}
                  {petOfTheDay.weight} g
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t("detail.height")}:</span>{" "}
                  {petOfTheDay.height} cm
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t("detail.length")}:</span>{" "}
                  {petOfTheDay.length} cm
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
}
