import { Video as IVideo } from "@/models/Video";

export type VideoFormData = Pick<
  IVideo,
  "title" | "description" | "videoUrl" | "controls" | "transformation"
>;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    try {
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null);
        throw new Error(
          errorResponse?.error ||
            `Request failed with status ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      throw new Error(
        error instanceof Error ? error.message : "Network request failed"
      );
    }
  }

  async getVideos(): Promise<IVideo[]> {
    return this.fetch<IVideo[]>("/videos");
  }

  async createVideo(videoData: VideoFormData): Promise<IVideo> {
    return this.fetch<IVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }

  async fetchVideoById(id: string) {
    const res = await fetch(`/api/videos/${id}`);
    if (!res.ok) throw new Error("Video not found");
    return res.json();
  }
}

export const apiClient = new ApiClient();
