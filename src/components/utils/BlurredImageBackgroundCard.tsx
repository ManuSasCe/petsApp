import React, { useState, useEffect, useMemo } from "react";
import { Spinner } from "flowbite-react";
import { CameraPhoto } from "flowbite-react-icons/outline";
import { Pet } from "../../types";
import { useTranslation } from "react-i18next";

interface BlurredImageBackgroundCardProps {
  pet: Pet;
  className?: string;
}

// Helper function to check if the image URL has a supported extension
const isSupportedImageType = (url: string): boolean => {
  if (!url) return false;
  const extension = url.split(".").pop()?.toLowerCase();
  // Supported image formats
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "");
};

const BlurredImageBackgroundCard: React.FC<BlurredImageBackgroundCardProps> = ({
  pet,
  className = "h-56 w-full",
}) => {
  const { t } = useTranslation();

  const [loadStatus, setLoadStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const imageUrl = pet.photo_url;

  // Memoize the result of image type check to avoid recalculation on every render!!!
  const isValidType = useMemo(() => isSupportedImageType(imageUrl), [imageUrl]);

  useEffect(() => {
    // If no URL or the type is not supported, set status to error
    if (!imageUrl || !isValidType) {
      setLoadStatus("error");
      return; // Exit effect early
    }

    setLoadStatus("loading");
    const img = new Image();
    img.onload = () => setLoadStatus("loaded");
    img.onerror = () => setLoadStatus("error");
    img.src = imageUrl;
  }, [imageUrl, isValidType]);

  const altText = t("No valid photo", { name: pet.name, kind: pet.kind });

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}
    >
      {loadStatus === "loaded" && isValidType && (
        <div
          className="absolute inset-0 size-full scale-110 blur-xl brightness-75"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 flex size-full items-center justify-center">
        {loadStatus === "loading" && (
          <Spinner
            aria-label={t("image_status.loading", { name: pet.name })}
            size="lg"
          />
        )}

        {loadStatus === "error" && (
          <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <CameraPhoto className="mb-1 size-12" />
            <span className="text-xs">{t("No photo")}</span>
          </div>
        )}

        {loadStatus === "loaded" && isValidType && (
          <img
            className="z-10 h-full w-full object-scale-down"
            src={imageUrl}
            alt={altText}
          />
        )}
      </div>
    </div>
  );
};

export default BlurredImageBackgroundCard;
