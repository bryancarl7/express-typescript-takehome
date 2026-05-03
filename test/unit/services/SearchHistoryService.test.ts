import { SearchHistory } from '../../../src/api/models/SearchHistory';
import { SearchHistoryService } from '../../../src/api/services/SearchHistoryService';
import { LogMock } from '../lib/LogMock';
import { RepositoryMock } from '../lib/RepositoryMock';

const makeDocs = (count: number) =>
    Array.from({ length: count }, (_, i) => ({ title: `Book ${String.fromCharCode(90 - i)}` }));

const mockFetch = (numFound: number, docs: Array<{ title: string }>) => {
    (global as any).fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ numFound, docs }),
    });
};

describe('SearchHistoryService', () => {

    let service: SearchHistoryService;
    let repo: RepositoryMock<SearchHistory>;
    let log: LogMock;

    beforeEach(() => {
        repo = new RepositoryMock<SearchHistory>();
        log = new LogMock();
        service = new SearchHistoryService(repo as any, log);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('search()', () => {

        test('returns resultCount and first 10 titles from OpenLibrary', async (done) => {
            mockFetch(500, makeDocs(15));
            const result = await service.search('bryan', 'NASA');
            expect(result.resultCount).toBe(500);
            expect(result.titles).toHaveLength(10);
            done();
        });

        test('returns all titles when fewer than 10 results exist', async (done) => {
            mockFetch(3, makeDocs(3));
            const result = await service.search('bryan', 'rare topic');
            expect(result.titles).toHaveLength(3);
            done();
        });

        test('saves a SearchHistory record to the repository', async (done) => {
            mockFetch(42, makeDocs(5));
            await service.search('bryan', 'space');
            const saved = repo.saveMock.mock.calls[0][0] as SearchHistory;
            expect(saved.username).toBe('bryan');
            expect(saved.searchTerm).toBe('space');
            expect(saved.resultCount).toBe(42);
            done();
        });

        test('returns empty titles array when API returns no docs', async (done) => {
            mockFetch(0, []);
            const result = await service.search('bryan', 'xyzzy');
            expect(result.resultCount).toBe(0);
            expect(result.titles).toHaveLength(0);
            done();
        });

    });

    describe('sortCachedTitles()', () => {

        test('returns undefined when no search has been made for the user', () => {
            const result = service.sortCachedTitles('unknown');
            expect(result).toBeUndefined();
        });

        test('returns titles sorted alphabetically after a search', async (done) => {
            mockFetch(10, [{ title: 'Zebra' }, { title: 'Apple' }, { title: 'Mango' }]);
            await service.search('bryan', 'fruits');
            const sorted = service.sortCachedTitles('bryan');
            expect(sorted).toEqual(['Apple', 'Mango', 'Zebra']);
            done();
        });

        test('does not mutate the original cached order', async (done) => {
            mockFetch(3, [{ title: 'Zebra' }, { title: 'Apple' }]);
            await service.search('bryan', 'animals');
            service.sortCachedTitles('bryan');
            const sorted2 = service.sortCachedTitles('bryan');
            expect(sorted2[0]).toBe('Apple');
            done();
        });

        test('cache is keyed per user', async (done) => {
            mockFetch(1, [{ title: 'Bryan Book' }]);
            await service.search('bryan', 'test');
            expect(service.sortCachedTitles('alice')).toBeUndefined();
            done();
        });

    });

    describe('findByUsername()', () => {

        const makeHistory = (overrides: Partial<SearchHistory>): SearchHistory => {
            const h = new SearchHistory();
            h.username = 'bryan';
            h.searchTerm = 'nasa';
            h.resultCount = 10;
            h.createdAt = new Date();
            return Object.assign(h, overrides);
        };

        test('returns all records for a user without sorting', async (done) => {
            repo.list = [
                makeHistory({ searchTerm: 'nasa', resultCount: 100 }),
                makeHistory({ searchTerm: 'apollo', resultCount: 50 }),
            ];
            const result = await service.findByUsername('bryan');
            expect(result).toHaveLength(2);
            done();
        });

        test('sorts by resultCount descending when sort is resultCount', async (done) => {
            repo.list = [
                makeHistory({ resultCount: 10 }),
                makeHistory({ resultCount: 500 }),
                makeHistory({ resultCount: 75 }),
            ];
            const result = await service.findByUsername('bryan', 'resultCount');
            expect(result[0].resultCount).toBe(500);
            expect(result[2].resultCount).toBe(10);
            done();
        });

        test('sorts by searchTerm alphabetically when sort is searchTerm', async (done) => {
            repo.list = [
                makeHistory({ searchTerm: 'zebra' }),
                makeHistory({ searchTerm: 'apple' }),
                makeHistory({ searchTerm: 'mango' }),
            ];
            const result = await service.findByUsername('bryan', 'searchTerm');
            expect(result[0].searchTerm).toBe('apple');
            expect(result[2].searchTerm).toBe('zebra');
            done();
        });

        test('sorts by username alphabetically when sort is username', async (done) => {
            repo.list = [
                makeHistory({ username: 'zara' }),
                makeHistory({ username: 'alice' }),
            ];
            const result = await service.findByUsername('bryan', 'username');
            expect(result[0].username).toBe('alice');
            done();
        });

        test('returns empty array when user has no history', async (done) => {
            repo.list = [];
            const result = await service.findByUsername('nobody');
            expect(result).toHaveLength(0);
            done();
        });

    });

});
