import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, Badge, Button, Spinner, Alert } from "flowbite-react";
import { fetchPetById } from "../services/petService";
import { AngleLeft, AngleUp, Heart } from "flowbite-react-icons/outline";
import { calculatePetHealth } from "../utils/healthUtils";
import { Pet } from "../types";
import HealthBadge from "../components/utils/HealthBadge";
import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";
import BlurredImageBackgroundCard from "../components/utils/BlurredImageBackgroundCard";

export default function PetDetailPage() {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pet, setPet] = useState<Pet | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const getPet = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPetById(id!);
        setPet(data);
      } catch (err) {
        console.error("Error fetching pet:", err);
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    getPet();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <>
        <div className="flex h-64 items-center justify-center">
          <Spinner aria-label="Loading pet details" size="xl" />
        </div>
      </>
    );
  }

  if (!pet) {
    return (
      <>
        <div className="mx-auto max-w-md text-center">
          <Alert color="failure" icon={AngleUp} className="mb-4">
            Pet not found
          </Alert>
          <Button as={Link} to="/" color="blue">
            Return to Home
          </Button>
        </div>
      </>
    );
  }

  const healthStatus = calculatePetHealth(pet);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-6 px-4">
        <div className="mb-6 flex items-center space-x-5">
          <Button as={Link} size="sm" className="flex items-center" to={"/"}>
            <AngleLeft className="mr-1.5 size-4" />
            {t("buttons.back")}
          </Button>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {pet.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <Card className="overflow-hidden border-0 p-0 shadow-md">
            <div className="flex aspect-square items-center justify-center bg-gray-100 dark:bg-gray-800">
              <BlurredImageBackgroundCard
                pet={pet}
                className="h-full w-full flex-shrink-0"
              />
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 shadow-md dark:from-gray-800 dark:to-gray-800">
              <div className="flex justify-between">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <HealthBadge status={healthStatus} />
                </div>
                <Badge color="gray" className="rounded-full text-sm capitalize">
                  {t(`pet_types.${pet.kind.toLowerCase()}`)}
                </Badge>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3 border-b border-gray-200 pb-4 dark:border-gray-700 md:grid-cols-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t("detail.weight")}
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {pet.weight}g
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t("detail.height")}
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {pet.height}cm
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t("detail.length")}
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {pet.length}cm
                  </p>
                </div>
                {pet.kind.toLowerCase() === "cat" &&
                  pet.number_of_lives !== undefined && (
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t("detail.lives_left")}
                      </p>
                      <div className="inline-flex items-baseline space-x-1 text-xl font-semibold text-gray-900 dark:text-white">
                        <span>{pet.number_of_lives}</span>
                        <Heart
                          className="relative top-0.5 text-red-800"
                          size={18}
                        />
                      </div>
                    </div>
                  )}
              </div>

              <div className="pt-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {t("detail.title")} {pet.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {pet.description}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
