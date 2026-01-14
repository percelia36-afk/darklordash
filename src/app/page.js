"use client";
import { useState, useEffect } from "react";
import { verifyPasscode } from "./actions/passcode";

export default function Home() {
  const [showPasscode, setShowPasscode] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black relative">
      {showPasscode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg flex flex-col items-center gap-4 min-w-[320px]">
            <h2 className="text-xl font-bold text-black dark:text-zinc-50">
              Enter Passcode
            </h2>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Passcode"
              autoFocus
            />
            {passError && (
              <div className="text-red-600 text-sm">{passError}</div>
            )}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold w-full"
              onClick={async () => {
                setPassError("");
                const result = await verifyPasscode(passcode);
                if (result.success) {
                  setShowPasscode(false);
                } else {
                  setPassError("Incorrect passcode");
                }
              }}
            >
              Enter
            </button>
          </div>
        </div>
      )}
      <main
        className="flex flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black"
        style={{
          filter: showPasscode ? "blur(4px)" : "none",
          pointerEvents: showPasscode ? "none" : "auto",
        }}
      >
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">
          Welcome!
        </h1>
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <a
            href="/images"
            className="flex h-14 items-center justify-center rounded-lg bg-blue-600 text-white text-lg font-bold transition-colors hover:bg-blue-700"
          >
            Go to Images Page
          </a>
          <a
            href="/videos"
            className="flex h-14 items-center justify-center rounded-lg bg-green-600 text-white text-lg font-bold transition-colors hover:bg-green-700"
          >
            Go to Videos Page
          </a>
        </div>
      </main>
    </div>
  );
}
