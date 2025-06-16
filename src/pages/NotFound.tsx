
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2">404</CardTitle>
          <CardDescription className="text-xl">
            Oops! Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link to="/" className="flex items-center justify-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Return to Home</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500">
            Attempted to access: {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
