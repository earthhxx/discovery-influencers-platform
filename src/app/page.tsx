"use client";
import { useEffect, useState } from "react";

export default function InfluencersPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/selectdata")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  return (
    <div>
      <h1>Influencers List</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
