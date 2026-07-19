"use client";

import { useState, useEffect } from "react";
import { Activity, Wifi, WifiOff, Server, Clock } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Loader } from "@/components/Loader";

export default function HealthPage() {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setStatus("healthy");
      })
      .catch(() => {
        setData(null);
        setStatus("unhealthy");
      });
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-white">System Health</h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        Monitoring external API connectivity and system status.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2">
            <Server className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">Application</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Activity className="h-4 w-4 text-green-500" />
            Running
          </div>
        </div>

        <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-zinc-900 dark:text-white">Timestamp</h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-50 p-6 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-semibold text-zinc-900 dark:text-white">External API</h2>
          {status === "loading" ? (
            <Badge>Checking...</Badge>
          ) : status === "healthy" ? (
            <Badge variant="success">
              <Wifi className="mr-1 h-3 w-3" /> Connected
            </Badge>
          ) : (
            <Badge variant="default">
              <WifiOff className="mr-1 h-3 w-3" /> Disconnected
            </Badge>
          )}
        </div>

        {status === "loading" && <Loader />}

        {status === "healthy" && data && (
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p><span className="font-medium text-zinc-800 dark:text-zinc-200">Endpoint:</span> jsonplaceholder.typicode.com/todos/1</p>
            <p><span className="font-medium text-zinc-800 dark:text-zinc-200">Status:</span> 200 OK</p>
            <p><span className="font-medium text-zinc-800 dark:text-zinc-200">Response:</span></p>
            <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-3 text-xs dark:bg-zinc-800">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {status === "unhealthy" && (
          <p className="text-sm text-red-500">
            Unable to reach the external API. The service may be down or there is a network issue.
          </p>
        )}
      </div>
    </div>
  );
}
