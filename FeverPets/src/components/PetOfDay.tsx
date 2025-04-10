import { Card, Badge, Spinner } from "flowbite-react";
import { CalendarEdit } from "flowbite-react-icons/outline";
import { Link } from "react-router-dom";
import { calculatePetHealth } from "../utils/healthUtils";
import HealthBadge from "./HealthBadge";
import { usePetOfTheDay } from "../utils/petOfDayUtils";
import { Pet } from "../types";

export default function PetOfDay({ allPets }: { allPets: Pet[] }) {
  console.log("viva")
  const petOfTheDay = usePetOfTheDay(allPets);

  if (!allPets.length) return null;

  if (!petOfTheDay) {
    return (
      <Card className="animate-pulse text-center">
        <div className="flex items-center justify-center">
          <CalendarEdit className="mr-2 size-5" />
          <h5 className="text-lg font-medium">Pet of the Day</h5>
        </div>
        <div className="flex h-40 items-center justify-center">
          <Spinner aria-label="Loading pet of the day" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center">
          <CalendarEdit className="mr-2 size-5" />
          <h5 className="text-lg font-medium">Pet of the Day</h5>
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
                <Badge color="gray" className="capitalize">
                  {petOfTheDay.kind}
                </Badge>
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Weight:</span>{" "}
                  {petOfTheDay.weight} g
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Height:</span>{" "}
                  {petOfTheDay.height} cm
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Length:</span>{" "}
                  {petOfTheDay.length} cm
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3 dark:bg-gray-800">
        {petOfTheDay && (
          <HealthBadge status={calculatePetHealth(petOfTheDay)} />
        )}
        <span className="animate-pulse text-sm text-gray-500 dark:text-gray-400">
          Click to view details
        </span>
      </div>
    </Card>
  );
}
