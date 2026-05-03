import { EntityRepository, Repository } from 'typeorm';

import { SearchHistory } from '../models/SearchHistory';

@EntityRepository(SearchHistory)
export class SearchHistoryRepository extends Repository<SearchHistory> {

}
