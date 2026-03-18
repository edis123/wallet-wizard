import { useState, useEffect } from "react";
import { fetchMethod } from "@/lib/api";

function Title() {
  const [title, setTitle] = useState<{ title: string }>({
    title: "LOADING...",
  });
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

  return (
    <div className="text-3xl font-bold text-gray-800 flex  item-center justify-center">
      {title.title}
    </div>
  );
}
export default Title;
