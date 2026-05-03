import { IsNotEmpty, MaxLength } from 'class-validator';
import { Body, Get, JsonController, Post, QueryParam } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { SearchHistory } from '../models/SearchHistory';
import { SearchHistoryService, SortField } from '../services/SearchHistoryService';

class SearchBody {
    @IsNotEmpty()
    @MaxLength(50)
    public username: string;

    @IsNotEmpty()
    @MaxLength(200)
    public searchTerm: string;
}

export class SearchResponse {
    public resultCount: number;
    public titles: string[];
}

export class SearchHistoryResponse {
    public id: string;
    public username: string;
    public searchTerm: string;
    public resultCount: number;
    public createdAt: Date;
}

@JsonController('/searches')
export class SearchController {

    constructor(
        private searchHistoryService: SearchHistoryService
    ) { }

    @Post()
    @ResponseSchema(SearchResponse)
    @OpenAPI({ summary: 'Search OpenLibrary and save result' })
    public async search(@Body() body: SearchBody): Promise<SearchResponse> {
        const { resultCount, titles } = await this.searchHistoryService.search(
            body.username,
            body.searchTerm
        );
        return { resultCount, titles };
    }

    @Get()
    @ResponseSchema(SearchHistoryResponse, { isArray: true })
    @OpenAPI({ summary: 'Get search history for a user' })
    public history(
        @QueryParam('username') username: string,
        @QueryParam('sort') sort?: SortField
    ): Promise<SearchHistory[]> | { error: string } {
        if (!username) { return Promise.resolve([]); }
        return this.searchHistoryService.findByUsername(username, sort);
    }

    @Get('/sort-titles')
    @OpenAPI({ summary: 'Sort the cached titles for a user' })
    public sortTitles(@QueryParam('username') username: string): { titles: string[] } | { error: string } {
        const titles = this.searchHistoryService.sortCachedTitles(username);
        if (!titles) { return { error: 'No cached results found. Please search first.' }; }
        return { titles };
    }

}
