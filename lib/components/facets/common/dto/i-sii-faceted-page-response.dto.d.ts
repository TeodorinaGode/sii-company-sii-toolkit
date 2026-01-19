import { SiiFacetDto } from './i-sii-facet.dto';
import { ISiiPageResponseDTO } from '../../../../dto/i-sii-page-response.dto';
export type SiiFacetedPageResponseDTO<T> = {
    rows: ISiiPageResponseDTO<T>;
    facets: Array<SiiFacetDto>;
};
