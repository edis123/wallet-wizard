"use client";

import { useEffect, useState } from "react";
import { fetchMethod } from "@/lib/api";

function Title() {
  const [title, setTitle] = useState<{ title: string }>({ title: "LOADING..." });
  const [error, setError] = useState("");

  useEffect(() => {
    async function showTitle() {
      try {
        const titleData = await fetchMethod.fetching("/api/title", {
          method: "GET",
        });
        setTitle(titleData);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to LOAD TITLE!");
      }
    }

    showTitle();
  }, []);

  if (error) return <div>{error}</div>;

  return <div>{title.title}</div>;
}

export default Title;