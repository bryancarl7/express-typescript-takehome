import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchHistory } from '../models/SearchHistory';
import { SearchHistoryRepository } from '../repositories/SearchHistoryRepository';

export type SortField = 'username' | 'searchTerm' | 'resultCount';

@Service()
export class SearchHistoryService {

    private titleCache = new Map<string, string[]>();

    constructor(
        @OrmRepository() private searchHistoryRepository: SearchHistoryRepository,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async search(username: string, searchTerm: string): Promise<{ resultCount: number; titles: string[] }> {
        this.log.info(`Searching OpenLibrary for: ${searchTerm}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        let response: Response;
        try {
            response = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}`,
                { signal: controller.signal }
            );
        } finally {
            clearTimeout(timeout);
        }
        const data = await response.json() as { numFound: number; docs: Array<{ title: string }> };

        const resultCount = data.numFound;
        const titles = data.docs.slice(0, 10).map(doc => doc.title);

        this.titleCache.set(username, titles);

        const record = new SearchHistory();
        record.username = username;
        record.searchTerm = searchTerm;
        record.resultCount = resultCount;
        await this.searchHistoryRepository.save(record);

        return { resultCount, titles };
    }

    public sortCachedTitles(username: string): string[] | undefined {
        const titles = this.titleCache.get(username);
        if (!titles) { return undefined; }
        return [...titles].sort((a, b) => a.localeCompare(b));
    }

    public async findByUsername(username: string, sort?: SortField): Promise<SearchHistory[]> {
        this.log.info(`Fetching search history for: ${username}`);

        const results = await this.searchHistoryRepository.find({ where: { username } });

        if (sort) {
            results.sort((a, b) => {
                const valA = a[sort];
                const valB = b[sort];
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return valB - valA;
                }
                return String(valA).localeCompare(String(valB));
            });
        }

        return results;
    }

}
