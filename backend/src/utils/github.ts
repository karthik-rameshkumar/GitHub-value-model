import { GitHubRepository } from '../types';

/**
 * Maps a GitHub API repository response to our internal GitHubRepository type.
 * This eliminates duplication across multiple repository service methods.
 */
export function mapRepositoryData(repo: any): GitHubRepository {
  return {
    id: repo.id,
    nodeId: repo.node_id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || null,
    language: repo.language || null,
    defaultBranch: repo.default_branch || 'main',
    isPrivate: repo.private,
    createdAt: new Date(repo.created_at || repo.updated_at || Date.now()),
    updatedAt: new Date(repo.updated_at || repo.created_at || Date.now()),
    pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null
  };
}

/**
 * Generic pagination utility for fetching and filtering data by date range.
 * This eliminates duplication between pullRequests and deployments services.
 * 
 * @param fetchPage - Function to fetch a single page of data
 * @param since - Optional start date filter
 * @param until - Optional end date filter
 * @param getCreatedAt - Function to extract the creation date from an item
 * @param perPage - Items per page (default: 100)
 * @returns Array of filtered items
 */
export async function paginateWithDateFilter<T>(
  fetchPage: (page: number, perPage: number) => Promise<T[]>,
  since?: Date,
  until?: Date,
  getCreatedAt?: (item: T) => Date,
  perPage: number = 100
): Promise<T[]> {
  let allItems: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const items = await fetchPage(page, perPage);
    
    // Filter by date range if specified
    const filteredItems = items.filter(item => {
      if (!getCreatedAt) return true;
      const createdAt = getCreatedAt(item);
      if (since && createdAt < since) return false;
      if (until && createdAt > until) return false;
      return true;
    });
    
    allItems = allItems.concat(filteredItems);
    
    // If we got fewer than perPage items, we're done
    hasMore = items.length === perPage;
    page++;
    
    // Stop if we've gone past our date range
    if (since && items.length > 0 && getCreatedAt) {
      const lastItem = items[items.length - 1];
      if (lastItem && getCreatedAt(lastItem) < since) {
        hasMore = false;
      }
    }
  }

  return allItems;
}
