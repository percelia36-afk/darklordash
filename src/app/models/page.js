"use client";

import { useState, useEffect } from "react";
import { getModels, createModel, deleteModel } from "../actions/models";

export default function ModelsPage() {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [models, setModels] = useState([]);

  async function fetchModels() {
    const data = await getModels();
    if (data.success) setModels(data.models);
  }

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("url", url);
    formData.append("description", description);

    const data = await createModel(formData);
    if (data.success) {
      setMessage("Model posted successfully!");
      setUrl("");
      setDescription("");
      fetchModels();
    } else {
      setMessage("Error: " + data.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col gap-8 w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-zinc-50">
            Post a Model
          </h2>
          <input
            type="text"
            placeholder="Model URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 font-bold"
          >
            Post Model
          </button>
          {message && (
            <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
              {message}
            </p>
          )}
        </form>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow w-full">
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
            Posted Models
          </h3>
          <div className="flex flex-col gap-4">
            {models.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                No models posted yet.
              </p>
            ) : (
              models.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center gap-4 border-b pb-2"
                >
                  <img
                    src={model.url}
                    alt={model.description}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-black dark:text-zinc-50">
                      {model.description}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(model.uploaded_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await deleteModel(model.id);
                      fetchModels();
                    }}
                    className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
