import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Card, Badge, Button, Spinner, Alert } from "flowbite-react";
import { fetchPetById } from "../services/petService";
import { AngleLeft, AngleUp } from "flowbite-react-icons/outline";
import { calculatePetHealth } from "../utils/healthUtils";
import { Pet } from "../types";
import HealthBadge from "../components/HealthBadge";

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
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button as={Link} to={backToHomeWithParams} color="gray" pill>
            <AngleLeft className="size-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {pet.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="overflow-hidden p-0">
            <img
              src={pet.photo_url}
              alt={pet.name}
              className="size-full max-h-96 object-cover"
            />
          </Card>

          <div className="space-y-6">
            <Card>
              <div className="flex flex-wrap items-center gap-4">
                <Badge color="gray" className="text-base capitalize">
                  {pet.kind}
                </Badge>
                <HealthBadge status={healthStatus} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Weight
                  </p>
                  <p className="font-medium">{pet.weight} g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Height
                  </p>
                  <p className="font-medium">{pet.height} cm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Length
                  </p>
                  <p className="font-medium">{pet.length} cm</p>
                </div>
                {pet.kind.toLowerCase() === "cat" &&
                  pet.number_of_lives !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Lives Left
                      </p>
                      <p className="font-medium">{pet.number_of_lives}</p>
                    </div>
                  )}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <h3 className="mb-2 text-lg font-medium">About</h3>
                <p className="text-gray-700 dark:text-gray-400">
                  {pet.description}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
