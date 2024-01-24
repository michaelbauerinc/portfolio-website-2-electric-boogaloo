import { cache } from "./GlobalCache";

class GitHubApiClient {
  // Initialize the cache with no automatic expiration cuz we need it unless the pod restarts
  // cache = new NodeCache({ stdTTL: 0 });

  async fetchRepoData(repoUrl: string) {
    const repoName = this.extractRepoName(repoUrl);
    const cacheKey = `repoData-${repoName}`;

    // Check if data is in server cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Define API URLs
    const apiUrl = `https://api.github.com/repos/${repoName}`;
    const languagesUrl = `https://api.github.com/repos/${repoName}/languages`;

    try {
      // Fetch repository data
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }

      // Fetch repository languages
      const languagesResponse = await fetch(languagesUrl);
      const languagesData = await languagesResponse.json();
      if (languagesResponse.status !== 200) {
        throw new Error(
          `GitHub API responded with status: ${languagesResponse.status}`
        );
      }

      // Construct result object
      const result = {
        name: data.name,
        description: data.description,
        languages: Object.keys(languagesData),
        url: repoUrl,
      };

      // Store data in cache
      cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error("Error fetching repository data:", error);
      return null;
    }
  }

  extractRepoName(url: string) {
    const match = url.match(/github\.com\/(.+\/.+)/);
    return match ? match[1] : "";
  }
}

export default GitHubApiClient;
