"use client";

import { useState, useEffect } from "react";

export default function VideosPage() {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);

  async function fetchVideos() {
    const res = await fetch("/api/videos");
    const data = await res.json();
    if (data.success) setVideos(data.videos);
  }

  // Fetch videos on mount
  useEffect(() => {
    async function loadVideos() {
      await fetchVideos();
    }
    loadVideos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, description }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Video posted successfully!");
      setUrl("");
      setDescription("");
      fetchVideos();
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
            Post a Video
          </h2>
          <input
            type="text"
            placeholder="Video URL"
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
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 font-bold"
          >
            Post Video
          </button>
          {message && (
            <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
              {message}
            </p>
          )}
        </form>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow w-full">
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
            Posted Videos
          </h3>
          <div className="flex flex-col gap-4">
            {videos.length === 0 ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                No videos posted yet.
              </p>
            ) : (
              videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 border-b pb-2"
                >
                  {video.url.includes("youtube.com") ||
                  video.url.includes("youtu.be") ? (
                    <iframe
                      width="320"
                      height="180"
                      src={
                        video.url.includes("youtube.com")
                          ? video.url.replace("watch?v=", "embed/")
                          : `https://www.youtube.com/embed/${video.url
                              .split("/")
                              .pop()}`
                      }
                      title={video.description}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded"
                    />
                  ) : (
                    <video
                      src={video.url}
                      controls
                      className="w-32 h-24 rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-black dark:text-zinc-50">
                      {video.description}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(video.uploaded_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await fetch("/api/videos", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: video.id }),
                      });
                      fetchVideos();
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
