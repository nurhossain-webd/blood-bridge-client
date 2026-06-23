"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import axiosPublic from "@/lib/axiosPublic";

export default function useDbUser() {
  const { data: session, isPending } = useSession();

  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosPublic.get(
          `/users/${session.user.email}`
        );

        setDbUser(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      loadUser();
    }
  }, [session?.user?.email, isPending]);

  return {
    dbUser,
    loading,
  };
}