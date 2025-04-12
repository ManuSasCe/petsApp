import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { useTranslation } from 'react-i18next'; 

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation(); 

  useEffect(() => {
    console.error(
      `404 Error: User attempted to access non-existent route: ${location.pathname}`,
    );
  }, [location.pathname]);

  return (
    <>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="mb-2 text-6xl font-bold">{t("not_found.code")}</h1>
        <p className="mb-8 text-xl text-gray-600">{t("not_found.title")}</p>
        <p className="mb-8 max-w-md text-center text-gray-500">
          {t("not_found.description")}
        </p>
        <Link to="/">
          <Button size="lg">{t("not_found.button_home")}</Button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
