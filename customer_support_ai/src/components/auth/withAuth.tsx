"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import Spinner from "../spinner";

export function withAuth(WrappedComponent: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          router.push("/login"); // Redirect to login page
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (isLoading) {
      return <Spinner />; // Use the MUI Spinner component here
    }

    if (!isAuthenticated) {
      return null; // The useEffect will handle the redirect
    }

    return <WrappedComponent {...props} />;
  };
}
