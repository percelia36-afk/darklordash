"use client";

import { useState, useEffect } from "react";
import { getVideos, createVideo, deleteVideo } from "../actions/videos";

export default function VideosPage() {
  const [url, setUrl] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);

  async function fetchVideos() {
    const data = await getVideos();
    if (data.success) setVideos(data.videos);
  }

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("url", url);
    formData.append("game_title", gameTitle);
    formData.append("playlist_url", playlistUrl);
    formData.append("thumbnail_url", thumbnailUrl);

    const data = await createVideo(formData);
    if (data.success) {
      setMessage("Video posted successfully!");
      setUrl("");
      setGameTitle("");
      setPlaylistUrl("");
      setThumbnailUrl("");
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
          <input
            type="text"
            placeholder="Game Title"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Playlist URL"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
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
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.game_title}
                      className="w-32 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-32 h-24 bg-zinc-200 dark:bg-zinc-700 rounded flex items-center justify-center text-xs">
                      No thumbnail
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-black dark:text-zinc-50">
                      {video.game_title}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(video.uploaded_at).toLocaleString()}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      Video: {video.url}
                    </div>
                    {video.playlist_url && (
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        Playlist: {video.playlist_url}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={async () => {
                      await deleteVideo(video.id);
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
