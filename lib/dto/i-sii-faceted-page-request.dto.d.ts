import { SiiSortGroup } from './i-sii-group.dto';
import { SiiSortDTO } from './i-sii-sort.dto';
export type SiiFacetedPageRequestDTO = {
    sort: SiiSortDTO;
    group?: SiiSortGroup;
    textSearch: string;
    page: number;
    fetchSize: number;
    selected: object;
    startKey?: any;
};
