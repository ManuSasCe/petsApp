import { Card, Spinner } from "flowbite-react";
import { CalendarEdit } from "flowbite-react-icons/outline";
import { Pet } from "../types";
import { useTranslation } from "react-i18next";
import PetCard from "./PetCard";
import { usePetOfTheDay } from "../utils/PetOfDayUtils";

export default function PetOfDay({ allPets }: { allPets: Pet[] }) {
  const petOfTheDay = usePetOfTheDay(allPets);
  const { t } = useTranslation();

  if (!allPets.length) return <p>{t("pet_day.error")}</p>;

  if (!petOfTheDay) {
    return (
      <Card className="animate-pulse text-center">
        <div className="flex items-center justify-center dark:text-gray-400">
          <CalendarEdit className="mr-2 size-5" />
          <h5 className="text-lg font-medium ">{t("pet_day.title")}</h5>
        </div>
        <div className="flex h-40 items-center justify-center">
          <Spinner aria-label={t("pet_day.loading")} />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-4 flex items-center justify-center dark:text-gray-200">
        <CalendarEdit className="mr-2 size-5" />
        <h5 className="text-lg font-medium">{t("pet_day.title")}</h5>
      </div>

      <PetCard pet={petOfTheDay} horizontalCard />
    </div>
  );
}
