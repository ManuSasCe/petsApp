import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <>
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="mb-2 text-6xl font-bold">404</h1>
        <p className="mb-8 text-xl text-gray-600">Oops! Page not found</p>
        <p className="mb-8 max-w-md text-center text-gray-500">
          We couldn't find the pet you were looking for. Maybe it's hidding
          under the couch? =(
        </p>
        <Link to="/">
          <Button size="lg">Return to Home</Button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
