import axios from "axios";
import * as functions from "firebase-functions";

const config = functions.config();

// setup Axios
const yt = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  timeout: 3000,
});

export interface Video {
  id: string;
  title: string;
  link: string;
  publishedAt: string;
}

export type Playlist = Video;

/**
 * Returns latest videos
 * @param limit <number>
 */
export async function latestVideos(limit: number): Promise<Video[]> {
  return yt
    .get(
      `/search?key=${config.youtube.api_token}&channelId=${config.youtube.channel_id}&order=date&part=snippet&type=video&maxResults=${limit}`
    )
    .then(({ data }) => {
      return data.items.map((i: any) => {
        const videoId = i.id.videoId;
        return {
          id: videoId,
          title: i.snippet.title,
          link: `https://youtu.be/${videoId}`,
          publishedAt: i.snippet.publishedAt,
        };
      });
    })
    .catch((err) => {
      console.log(err.message);
      return [];
    });
}

/**
 * Returns latest playlists
 * @param limit <number>
 */
export async function latestPlaylist(limit: number): Promise<Playlist[]> {
  return yt
    .get(
      `/search?key=${config.youtube.api_token}&channelId=${config.youtube.channel_id}&order=date&part=snippet&type=playlist&maxResults=${limit}`
    )
    .then(({ data }) => {
      return data.items.map((i: any) => {
        const playlistId = i.id.playlistId;
        return {
          id: playlistId,
          title: i.snippet.title,
          link: `https://www.youtube.com/playlist?list=${playlistId}`,
          publishedAt: i.snippet.publishedAt,
        };
      });
    })
    .catch((err) => {
      console.log(err.message);
      return [];
    });
}

/**
 * Formatted latest videos
 * @param limit <number>
 */
export async function latestVideosMessage(limit: number = 10): Promise<string> {
  const videos = await latestVideos(limit);
  if (videos.length === 0) {
    return "Maaf, terdapat sedikit kendala! Silahkan coba lagi nanti.";
  }

  let message =
    "10 video terbaru di channel [UpKoding](https://www.youtube.com/c/UpKoding):\n\n";

  videos.forEach((v: Video) => {
    message += `→ [${v.title}](${v.link})\n`;
  });

  message +=
    "\nUntuk lebih lengkapnya silahkan cek [disini](https://www.youtube.com/c/UpKoding/videos)";
  return message;
}

/**
 * Formatted latest playlists
 * @param limit <number>
 */
export async function playlistMessage(limit: number = 10): Promise<string> {
  const playlist = await latestPlaylist(limit);
  if (playlist.length === 0) {
    return "Maaf, terdapat sedikit kendala! Silahkan coba lagi nanti.";
  }

  let message =
    "Playlists di channel [UpKoding](https://www.youtube.com/c/UpKoding):\n\n";

  playlist.forEach((v: Video) => {
    message += `→ [${v.title}](${v.link})\n`;
  });

  message +=
    "\nUntuk lebih lengkapnya silahkan cek [disini](https://www.youtube.com/c/UpKoding/playlists)";
  return message;
}
