import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Card, Badge, Button, Spinner, Alert } from "flowbite-react";
import { fetchPetById } from "../services/petService";
import { AngleLeft, AngleUp } from "flowbite-react-icons/outline";
import { calculatePetHealth } from "../utils/healthUtils";
import { Pet } from "../types";
import HealthBadge from "../components/HealthBadge";
import Layout from "../components/layout";

export default function PetDetailPage() {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pet, setPet] = useState<Pet | null>(null);

  // Parse the search params to maintain sorting when you go back
  const searchParams = new URLSearchParams(location.search);
  const backToHomeWithParams = `/${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

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
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="mb-8 flex items-center gap-4">
          <Button 
            as={Link} 
            to={backToHomeWithParams} 
            gradientMonochrome="purple" 
            pill 
            className="transition-transform hover:scale-105"
          >
            <AngleLeft className="mr-2 size-5" />
            Back to Home
          </Button>
          <div className="flex items-baseline gap-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {pet.name}
            </h1>
            <Badge color="purple" className="px-3 py-1.5 text-lg">
              {pet.kind.toLowerCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <Card className="overflow-hidden border-0 p-0 shadow-xl">
            <div className="flex aspect-square items-center justify-center bg-gray-100 dark:bg-gray-800">
              {pet.photo_url ? (
                <img
                  src={pet.photo_url}
                  alt={pet.name}
                  className="size-full rounded-lg object-cover"
                />
              ) : (
                <div className="text-xl text-gray-400">No image available</div>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl dark:from-gray-800 dark:to-gray-800">
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <HealthBadge status={healthStatus} />
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4 border-b border-gray-200 pb-6 md:grid-cols-3 dark:border-gray-700">
                <div className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Weight
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pet.weight}g
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Height
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pet.height}cm
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Length
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pet.length}cm
                  </p>
                </div>
                {pet.kind.toLowerCase() === "cat" &&
                  pet.number_of_lives !== undefined && (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Lives Left
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {pet.number_of_lives}
                        <span className="ml-1 text-lg text-purple-600 dark:text-purple-400">
                          ♡
                        </span>
                      </p>
                    </div>
                  )}
              </div>

              <div className="pt-6">
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  About {pet.name}
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
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