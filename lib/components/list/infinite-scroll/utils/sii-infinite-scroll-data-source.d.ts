import { BehaviorSubject } from 'rxjs';
import { SiiListController } from '../../../../service/sii-list-controller.service';
import { ISiiPageResponseDTO } from '../../../../dto/i-sii-page-response.dto';
export declare class SiiInfiniteScrollDataSource {
    siiListController: SiiListController;
    private lastFetchedpage;
    private _cachedData;
    private _dataStream;
    private _subscription;
    private performSearch;
    selectAllFetchedPage: Array<number>;
    get data(): BehaviorSubject<object[]>;
    get dataValue(): object[];
    get fetchSize(): number;
    get listSize(): number;
    private utils;
    constructor(siiListController: SiiListController);
    fetchNextPage(): void;
    listChangeSubscriptionFunction: (page: number, res: ISiiPageResponseDTO<any>, reset: boolean) => void;
    private _fetchPage;
    refreshSubscriptionFunction(): void;
    selectAllSubscriptionFunction(): void;
    checkForSelectAll(page: any): void;
}
