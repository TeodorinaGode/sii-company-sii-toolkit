import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../components/wait/sii-wait.service";
export class SiiListController {
    set lastFetchRequestInfo(lfri) {
        this._lastFetchRequestInfo = lfri;
        this.api.itemsCount = lfri.count;
    }
    get lastFetchRequestInfo() {
        return this._lastFetchRequestInfo;
    }
    constructor(waitService) {
        this.waitService = waitService;
        this._autosaveId = null;
        this._skipInitFacets = false;
        this._fetchSize = 20;
        this._currentpage = 0;
        this._lastEvaluatedKeyOfPage = {};
        this._maxFetchSize = 1000;
        this._sortField = { sort: null, sortAscending: true };
        this._groupField = { groupKey: null, groupValue: null };
        this.selectAllInProgress = false;
        this.currentFetchCall = Array();
        this.lastFacetRequest = { facets: {}, searchText: '' };
        this._selectionStatus = 'N';
        this._selectionMap = {};
        this._facetChangeSubj = new Subject();
        this.facetsData = this._facetChangeSubj.asObservable();
        this.doFetchPage = new Subject();
        this.fetchPage = this.doFetchPage.asObservable();
        this.executeSearch = new Subject();
        this.executeSearchObs = this.executeSearch.asObservable();
        this.facetsChange = new Subject();
        this.facetsChangeObs = this.facetsChange.asObservable();
        this.facetsReset = new Subject();
        this.facetsResetObs = this.facetsReset.asObservable();
        this.sortChange = new Subject();
        this.sortChangeObs = this.sortChange.asObservable();
        this._fetchPageDataSubj = new Subject();
        this.fetchPageData = this._fetchPageDataSubj.asObservable();
        this._selectedItemChangeSubj = new Subject();
        this._selectedItemsChangeSubj = new Subject();
        this._selectAllSubj = new Subject();
        this.selectAllObs = this._selectAllSubj.asObservable();
        this._refreshSubj = new Subject();
        this.refreshObs = this._refreshSubj.asObservable();
        this.setInitFacetsSubj = new Subject();
        this.setInitFacetsObs = this.setInitFacetsSubj.asObservable();
        this.changeFacetsSubj = new Subject();
        this.changeFacetsObs = this.changeFacetsSubj.asObservable();
        this.changeSearchTextSubj = new Subject();
        this.changeSearchTextObs = this.changeSearchTextSubj.asObservable();
        this.semaphoreFetch = 0;
        this.fetchInProgress = new BehaviorSubject(false);
        this.fetchInProgressObs = this.fetchInProgress.asObservable().pipe(distinctUntilChanged());
        this.api = {
            setAutoSave: (id, skipInitFacets = true) => { this.setAutosave(id, skipInitFacets); },
            setFetchService: (restService) => this._fetchService = restService,
            setFetchSize: (fs) => this._fetchSize = fs,
            setItemId: (id) => this._itemId = id,
            setMaxFetchSize: (mfs) => this._maxFetchSize = mfs,
            setInitFacets: (initFacets, searchText = '') => this.setInitfacets({ facets: initFacets, searchText }),
            changeFacets: (facets, searchText, resetOthers = true) => this.changeFacets(facets, searchText, resetOthers),
            selectedItemChange: this._selectedItemChangeSubj.asObservable(),
            selectedItemsChange: this._selectedItemsChangeSubj.asObservable(),
            selectAll: () => this.selectAll(),
            deselectAll: () => this.deselectAll(),
            refresh: () => this._refreshSubj.next(),
            reset: () => this.executeSearch.next(true),
            getFacet: (facetRef) => (this.lastFacetRequest || { facets: {} }).facets[facetRef],
            itemsCount: 0,
            selectedItemsCount: 0,
            getSelectedItems: () => Object.values(this._selectionMap),
            getFetchRequestData: () => this.getFetchRequestData()
        };
        // private changeSearchText(data: string){
        //   this.changeSearchTextSubj.next(data);
        // }
        this.getFetchRequestData = () => {
            return {
                fetchSize: this._fetchSize,
                page: this._currentpage,
                startKey: this._currentpage != 0 ? this._lastEvaluatedKeyOfPage[this._currentpage - 1] : null,
                selected: this.lastFacetRequest.facets,
                sort: this._sortField,
                group: this._groupField,
                textSearch: (this.lastFacetRequest.searchText.length === 0 ? null : this.lastFacetRequest.searchText)
            };
        };
        this.isSelected = (item) => {
            return this._selectionMap[item[this._itemId]] !== undefined;
        };
        this.fetchPage.subscribe((pagaReq) => {
            this._currentpage = pagaReq;
            this.executeSearch.next(false);
        });
        this.facetsChangeObs.subscribe((facetsChanges) => {
            this.lastFacetRequest = facetsChanges;
            this.executeSearch.next(true);
        });
        this.facetsResetObs.subscribe((facets) => {
            this.lastFacetRequest = facets;
            this.executeSearch.next(true);
        });
        this.sortChangeObs.subscribe(() => {
            this.executeSearch.next(true);
        });
        // this.searchChangeObs.subscribe((txt)=>{
        //   this._textSerch=txt;
        //   this.executeSearch.next(true);
        // })
        this.executeSearchObs
            .subscribe((reset) => {
            this.executeSearchFunction(reset);
        });
    }
    setAutosave(autosaveId, skipInitFacets) {
        this._autosaveId = autosaveId;
        const asaveDate = window.localStorage.getItem('siiList-' + this._autosaveId + 'date');
        if (asaveDate == null || ((new Date().getTime()) - parseInt(asaveDate, 10) - (1 * 24 * 60 * 60 * 1000) < 0)) {
            // se non è passato un giorno dall'ultimo salvataggio, riutilizzo i filtri salvati
            const asave = window.localStorage.getItem('siiList-' + this._autosaveId);
            if (asave != null && skipInitFacets) {
                try {
                    const jsonAsave = JSON.parse(asave);
                    this.setInitfacets({
                        facets: jsonAsave.selected,
                        searchText: (jsonAsave.textSearch || ''),
                        sort: jsonAsave.sort,
                        group: jsonAsave.group
                    });
                    this._skipInitFacets = true;
                }
                catch (err) {
                    console.log('Errore recupero configurazione lista salvata');
                }
            }
        }
    }
    setInitfacets(inif) {
        if (!this._skipInitFacets) {
            this.lastFacetRequest = inif;
            if (!!inif.sort) {
                this._sortField = inif.sort;
            }
            if (!!inif.group) {
                this._groupField = inif.group;
            }
            Promise.resolve().then(() => {
                this.setInitFacetsSubj.next(inif);
            });
        }
        else {
            this._skipInitFacets = false;
        }
    }
    changeFacets(facets, searchText, resetOthers) {
        if (facets != null || resetOthers) {
            this.changeFacetsSubj.next({ facets: (facets || {}), reset: resetOthers });
        }
        if (searchText != null || resetOthers) {
            this.changeSearchTextSubj.next(searchText || '');
        }
    }
    executeSearchFunction(reset = false) {
        if (reset) {
            this._currentpage = 0;
            this.deselectAll();
            this.currentFetchCall.forEach(i => i.unsubscribe());
            this.currentFetchCall.length == 0;
            this.semaphoreFetch = 0;
            this.hideFetchSpinner();
        }
        const page = this._currentpage;
        const ps = this._fetchSize;
        const fr = this.getFetchRequestData();
        this.waitService.skipNext();
        this.showFetchSpinner();
        this.currentFetchCall.push(this._fetchService(fr)
            .subscribe((resp) => {
            resp.rows.currPage = page;
            resp.rows.pageSize = ps;
            if (resp.rows.count == null) {
                resp.rows.count = ps * page + (resp.rows.data || []).length;
            }
            if (!!resp.rows?.lastEvaluatedKey) {
                this._lastEvaluatedKeyOfPage[page] = resp.rows?.lastEvaluatedKey;
                resp.rows.count += resp.rows?.lastEvaluatedKey == null ? 0 : 1;
            }
            resp.rows.maxPage = Math.ceil(resp.rows.count / ps);
            if (resp.facets != null) {
                this._facetChangeSubj.next(resp.facets);
            }
            this._fetchPageDataSubj.next({ page, rows: resp.rows, reset });
            this.hideFetchSpinner();
            if (!!this._autosaveId) {
                window.localStorage.setItem('siiList-' + this._autosaveId, JSON.stringify(fr));
                window.localStorage.setItem('siiList-' + this._autosaveId + 'date', new Date().getTime().toString());
            }
        }));
    }
    hideFetchSpinner() {
        this.semaphoreFetch--;
        if (this.semaphoreFetch < 0) {
            this.semaphoreFetch = 0;
        }
        if (this.semaphoreFetch === 0) {
            Promise.resolve().then(() => this.fetchInProgress.next(false));
        }
    }
    showFetchSpinner() {
        if (this.semaphoreFetch === 0) {
            Promise.resolve().then(() => this.fetchInProgress.next(true));
        }
        this.semaphoreFetch++;
    }
    // ----------start------------selections
    multiselectItemClick(selecteditem) {
        if (this._selectionMap[selecteditem[this._itemId]] === undefined) {
            // add item
            this._selectionMap[selecteditem[this._itemId]] = selecteditem;
        }
        else {
            // remove item
            delete this._selectionMap[selecteditem[this._itemId]];
        }
        this._selectedItemsChangeSubj.next(Object.values(this._selectionMap));
        this.updateSelectionStatus();
    }
    markAsSelected(items) {
        items.forEach((item) => {
            this._selectionMap[item[this._itemId]] = item;
        });
        this._selectedItemsChangeSubj.next(Object.values(this._selectionMap));
        this.updateSelectionStatus();
    }
    removeMissingSelection(items) {
        let someChange = false;
        Object.keys(this._selectionMap).forEach(selItemId => {
            if (items.filter(e => e !== undefined).findIndex(item => '' + item[this._itemId] === '' + selItemId) === -1) {
                delete this._selectionMap[selItemId];
                console.log(`rimuovo elemento ${selItemId} dopo il reload`);
                someChange = true;
            }
        });
        if (someChange) {
            this._selectedItemsChangeSubj.next(Object.values(this._selectionMap));
            this.updateSelectionStatus();
        }
    }
    singleselectItemClick(selecteditem) {
        if (this._selectionMap[selecteditem[this._itemId]] === undefined) {
            // add item
            this._selectionMap = {};
            this._selectionMap[selecteditem[this._itemId]] = selecteditem;
            this._selectedItemChangeSubj.next(this._selectionMap[selecteditem[this._itemId]]);
        }
        else {
            // remove item
            this._selectionMap = {};
            this._selectedItemChangeSubj.next(null);
        }
        this._selectedItemsChangeSubj.next(Object.values(this._selectionMap));
        this.updateSelectionStatus();
    }
    updateSelectionStatus() {
        this.api.selectedItemsCount = Object.values(this._selectionMap).length;
        switch (this.api.selectedItemsCount) {
            case 0:
                this._selectionStatus = 'N';
                break;
            case this.lastFetchRequestInfo.count:
                this._selectionStatus = 'A';
                break;
            default:
                this._selectionStatus = 'P';
                break;
        }
    }
    get selectionStatus() {
        return this._selectionStatus;
    }
    selectAll() {
        // se ci sono troppi elementi non posso fare la selezione
        // todo
        if (this.lastFetchRequestInfo.count > this._maxFetchSize) {
            alert('troppi elementi');
            return;
        }
        this._selectAllSubj.next();
    }
    deselectAll() {
        this._selectionMap = {};
        this._selectedItemsChangeSubj.next([]);
        this._selectedItemChangeSubj.next(null);
        this.updateSelectionStatus();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListController, deps: [{ token: i1.SiiWaitService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListController }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: SiiListController, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.SiiWaitService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLWxpc3QtY29udHJvbGxlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9zZXJ2aWNlL3NpaS1saXN0LWNvbnRyb2xsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUkxRSxPQUFPLEVBQWdCLG9CQUFvQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQVVwRSxNQUFNLE9BQU8saUJBQWlCO0lBaUI1QixJQUFJLG9CQUFvQixDQUFDLElBQThCO1FBQ3JELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNuQyxDQUFDO0lBQ0QsSUFBSSxvQkFBb0I7UUFDdEIsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUM7SUFDcEMsQ0FBQztJQWdGRCxZQUFvQixXQUEyQjtRQUEzQixnQkFBVyxHQUFYLFdBQVcsQ0FBZ0I7UUFyR3ZDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFFaEIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsNEJBQXVCLEdBQUMsRUFBRSxDQUFDO1FBQzNCLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLGVBQVUsR0FBZSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQzNELGdCQUFXLEdBQWlCLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDL0Qsd0JB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SUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQy9CLENBQUM7SUFFRCxTQUFTO1FBQ1AseURBQXlEO1FBQ3pELE9BQU87UUFDUCxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBQyxDQUFDO1lBQ3hELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3pCLE9BQU87UUFDVCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMvQixDQUFDOytHQWhYVSxpQkFBaUI7bUhBQWpCLGlCQUFpQjs7NEZBQWpCLGlCQUFpQjtrQkFEN0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2lpRmFjZXRlZFBhZ2VSZXF1ZXN0RFRPIH0gZnJvbSAnLi4vZHRvL2ktc2lpLWZhY2V0ZWQtcGFnZS1yZXF1ZXN0LmR0byc7XHJcbmltcG9ydCB7IElTaWlQYWdlUmVzcG9uc2VEVE8gfSBmcm9tICcuLi9kdG8vaS1zaWktcGFnZS1yZXNwb25zZS5kdG8nO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBTaWlGYWNldGVkUGFnZVJlc3BvbnNlRFRPIH0gZnJvbSAnLi4vY29tcG9uZW50cy9mYWNldHMvY29tbW9uL2R0by9pLXNpaS1mYWNldGVkLXBhZ2UtcmVzcG9uc2UuZHRvJztcclxuaW1wb3J0IHsgU2lpRmFjZXREdG8gfSBmcm9tICcuLi9jb21wb25lbnRzL2ZhY2V0cy9jb21tb24vZHRvL2ktc2lpLWZhY2V0LmR0byc7XHJcbmltcG9ydCB7IFNpaVNvcnREVE8gfSBmcm9tICcuLi9kdG8vaS1zaWktc29ydC5kdG8nO1xyXG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBGYWNldENoYW5nZXNEdG8gfSBmcm9tICcuLi9jb21wb25lbnRzL2ZhY2V0cy9jb21tb24vc2VydmljZS9zaWktZmFjZXQuc2VydmljZSc7XHJcbmltcG9ydCB7IFNpaVdhaXRTZXJ2aWNlIH0gZnJvbSAnLi4vY29tcG9uZW50cy93YWl0L3NpaS13YWl0LnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTaWlTb3J0R3JvdXAgfSBmcm9tICcuLi9kdG8vaS1zaWktZ3JvdXAuZHRvJztcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcclxuZXhwb3J0IHR5cGUgU2lpTGlzdFJlc3RTZXJ2aWNlVHlwZSA9ICggcmVxdWVzdDogU2lpRmFjZXRlZFBhZ2VSZXF1ZXN0RFRPKSA9PiBPYnNlcnZhYmxlPFNpaUZhY2V0ZWRQYWdlUmVzcG9uc2VEVE88YW55Pj47XHJcbmV4cG9ydCB0eXBlIHNlbGVjdGlvblN0YXR1c1R5cGUgPSAnQScgfCAnUCcgfCAnTic7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBTaWlMaXN0Q29udHJvbGxlcntcclxuICBwcml2YXRlIF9mZXRjaFNlcnZpY2U6IFNpaUxpc3RSZXN0U2VydmljZVR5cGU7XHJcbiAgcHJpdmF0ZSBfYXV0b3NhdmVJZCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBfc2tpcEluaXRGYWNldHMgPSBmYWxzZTtcclxuICBfZmV0Y2hTaXplID0gMjA7XHJcbiAgX2l0ZW1JZDtcclxuICBfY3VycmVudHBhZ2UgPSAwO1xyXG4gIF9sYXN0RXZhbHVhdGVkS2V5T2ZQYWdlPXt9O1xyXG4gIF9tYXhGZXRjaFNpemUgPSAxMDAwO1xyXG4gIF9zb3J0RmllbGQ6IFNpaVNvcnREVE8gPSB7c29ydDogbnVsbCwgc29ydEFzY2VuZGluZzogdHJ1ZX07XHJcbiAgX2dyb3VwRmllbGQ6IFNpaVNvcnRHcm91cCA9IHtncm91cEtleTogbnVsbCwgZ3JvdXBWYWx1ZTogbnVsbH07XHJcbiAgc2VsZWN0QWxsSW5Qcm9ncmVzcyA9IGZhbHNlO1xyXG4gIGN1cnJlbnRGZXRjaENhbGwgPSBBcnJheTxTdWJzY3JpcHRpb24+KCk7XHJcbiAgLy8gY3VycmVudEZldGNoQ2FsbCA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuXHJcbiAgcHJpdmF0ZSBfbGFzdEZldGNoUmVxdWVzdEluZm86IElTaWlQYWdlUmVzcG9uc2VEVE88YW55PiA7XHJcblxyXG4gIHNldCBsYXN0RmV0Y2hSZXF1ZXN0SW5mbyhsZnJpOiBJU2lpUGFnZVJlc3BvbnNlRFRPPGFueT4gKXtcclxuICAgIHRoaXMuX2xhc3RGZXRjaFJlcXVlc3RJbmZvID0gbGZyaTtcclxuICAgIHRoaXMuYXBpLml0ZW1zQ291bnQgPSBsZnJpLmNvdW50O1xyXG4gIH1cclxuICBnZXQgbGFzdEZldGNoUmVxdWVzdEluZm8oKTogSVNpaVBhZ2VSZXNwb25zZURUTzxhbnk+IHtcclxuICAgIHJldHVybiB0aGlzLl9sYXN0RmV0Y2hSZXF1ZXN0SW5mbztcclxuICB9XHJcblxyXG5cclxuICBsYXN0RmFjZXRSZXF1ZXN0OiBGYWNldENoYW5nZXNEdG8gPSB7ZmFjZXRzOiB7fSwgc2VhcmNoVGV4dDogJyd9O1xyXG5cclxuICBfc2VsZWN0aW9uU3RhdHVzOiBzZWxlY3Rpb25TdGF0dXNUeXBlID0gJ04nO1xyXG4gIF9zZWxlY3Rpb25NYXAgPSB7fTtcclxuXHJcbiAgcHJpdmF0ZSBfZmFjZXRDaGFuZ2VTdWJqID0gbmV3IFN1YmplY3Q8QXJyYXk8U2lpRmFjZXREdG8+PigpO1xyXG4gIHB1YmxpYyBmYWNldHNEYXRhID0gdGhpcy5fZmFjZXRDaGFuZ2VTdWJqLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBwdWJsaWMgZG9GZXRjaFBhZ2UgPSBuZXcgU3ViamVjdDxudW1iZXI+KCk7XHJcbiAgcHJpdmF0ZSBmZXRjaFBhZ2UgPSB0aGlzLmRvRmV0Y2hQYWdlLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBwdWJsaWMgZXhlY3V0ZVNlYXJjaCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XHJcbiAgcHJpdmF0ZSBleGVjdXRlU2VhcmNoT2JzID0gdGhpcy5leGVjdXRlU2VhcmNoLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBwdWJsaWMgZmFjZXRzQ2hhbmdlID0gbmV3IFN1YmplY3Q8RmFjZXRDaGFuZ2VzRHRvPigpO1xyXG4gIHByaXZhdGUgZmFjZXRzQ2hhbmdlT2JzID0gdGhpcy5mYWNldHNDaGFuZ2UuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIHB1YmxpYyBmYWNldHNSZXNldCA9IG5ldyBTdWJqZWN0PG9iamVjdD4oKTtcclxuICBwcml2YXRlIGZhY2V0c1Jlc2V0T2JzID0gdGhpcy5mYWNldHNSZXNldC5hc09ic2VydmFibGUoKTtcclxuXHJcblxyXG4gIHB1YmxpYyBzb3J0Q2hhbmdlID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcclxuICBwcml2YXRlIHNvcnRDaGFuZ2VPYnMgPSB0aGlzLnNvcnRDaGFuZ2UuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIHByaXZhdGUgX2ZldGNoUGFnZURhdGFTdWJqID0gbmV3IFN1YmplY3Q8e3BhZ2U6IG51bWJlciwgcm93czogSVNpaVBhZ2VSZXNwb25zZURUTzxhbnk+LCByZXNldDogYm9vbGVhbn0+KCk7XHJcbiAgcHVibGljIGZldGNoUGFnZURhdGEgPSB0aGlzLl9mZXRjaFBhZ2VEYXRhU3Viai5hc09ic2VydmFibGUoKTtcclxuXHJcblxyXG4gIHByaXZhdGUgX3NlbGVjdGVkSXRlbUNoYW5nZVN1YmogPSBuZXcgU3ViamVjdDxvYmplY3Q+KCk7XHJcbiAgcHJpdmF0ZSBfc2VsZWN0ZWRJdGVtc0NoYW5nZVN1YmogPSBuZXcgU3ViamVjdDxvYmplY3RbXT4oKTtcclxuXHJcbiAgcHJpdmF0ZSBfc2VsZWN0QWxsU3ViaiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcbiAgcHVibGljIHNlbGVjdEFsbE9icyA9IHRoaXMuX3NlbGVjdEFsbFN1YmouYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIHByaXZhdGUgX3JlZnJlc2hTdWJqID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcclxuICBwdWJsaWMgcmVmcmVzaE9icyA9IHRoaXMuX3JlZnJlc2hTdWJqLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBwcml2YXRlIHNldEluaXRGYWNldHNTdWJqID0gbmV3IFN1YmplY3Q8RmFjZXRDaGFuZ2VzRHRvPigpO1xyXG4gIHNldEluaXRGYWNldHNPYnMgPSB0aGlzLnNldEluaXRGYWNldHNTdWJqLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBwcml2YXRlIGNoYW5nZUZhY2V0c1N1YmogPSBuZXcgU3ViamVjdDx7ZmFjZXRzOiBvYmplY3QsIHJlc2V0OiBib29sZWFufT4oKTtcclxuICBjaGFuZ2VGYWNldHNPYnMgPSB0aGlzLmNoYW5nZUZhY2V0c1N1YmouYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIHByaXZhdGUgY2hhbmdlU2VhcmNoVGV4dFN1YmogPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgY2hhbmdlU2VhcmNoVGV4dE9icyA9IHRoaXMuY2hhbmdlU2VhcmNoVGV4dFN1YmouYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIHByaXZhdGUgc2VtYXBob3JlRmV0Y2ggPSAwO1xyXG4gIGZldGNoSW5Qcm9ncmVzcyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xyXG4gIGZldGNoSW5Qcm9ncmVzc09icyA9IHRoaXMuZmV0Y2hJblByb2dyZXNzLmFzT2JzZXJ2YWJsZSgpLnBpcGUoIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpO1xyXG5cclxuXHJcbiAgYXBpID0ge1xyXG4gICAgc2V0QXV0b1NhdmU6IChpZDogc3RyaW5nLCBza2lwSW5pdEZhY2V0cyA9IHRydWUpID0+IHsgdGhpcy5zZXRBdXRvc2F2ZShpZCwgc2tpcEluaXRGYWNldHMpOyB9LFxyXG4gICAgc2V0RmV0Y2hTZXJ2aWNlOiAocmVzdFNlcnZpY2U6IFNpaUxpc3RSZXN0U2VydmljZVR5cGUpID0+IHRoaXMuX2ZldGNoU2VydmljZSA9IHJlc3RTZXJ2aWNlLFxyXG4gICAgc2V0RmV0Y2hTaXplOiAoZnM6IG51bWJlcikgPT4gdGhpcy5fZmV0Y2hTaXplID0gZnMsXHJcbiAgICBzZXRJdGVtSWQ6ICggaWQ6IHN0cmluZykgPT4gICB0aGlzLl9pdGVtSWQgPSBpZCxcclxuICAgIHNldE1heEZldGNoU2l6ZTogKCBtZnM6IG51bWJlcikgPT4gIHRoaXMuX21heEZldGNoU2l6ZSA9IG1mcyxcclxuICAgIHNldEluaXRGYWNldHM6IChpbml0RmFjZXRzOiBvYmplY3QsIHNlYXJjaFRleHQ9ICcnKSA9PiB0aGlzLnNldEluaXRmYWNldHMoe2ZhY2V0czogaW5pdEZhY2V0cywgc2VhcmNoVGV4dH0pLFxyXG4gICAgY2hhbmdlRmFjZXRzOiAoZmFjZXRzPzogb2JqZWN0LCBzZWFyY2hUZXh0Pzogc3RyaW5nLCByZXNldE90aGVycz0gdHJ1ZSkgPT4gdGhpcy5jaGFuZ2VGYWNldHMoIGZhY2V0cywgc2VhcmNoVGV4dCwgcmVzZXRPdGhlcnMpLFxyXG4gICAgc2VsZWN0ZWRJdGVtQ2hhbmdlIDogdGhpcy5fc2VsZWN0ZWRJdGVtQ2hhbmdlU3Viai5hc09ic2VydmFibGUoKSxcclxuICAgIHNlbGVjdGVkSXRlbXNDaGFuZ2U6IHRoaXMuX3NlbGVjdGVkSXRlbXNDaGFuZ2VTdWJqLmFzT2JzZXJ2YWJsZSgpLFxyXG4gICAgc2VsZWN0QWxsOiAoKSA9PiB0aGlzLnNlbGVjdEFsbCgpLFxyXG4gICAgZGVzZWxlY3RBbGw6ICgpID0+IHRoaXMuZGVzZWxlY3RBbGwoKSxcclxuICAgIHJlZnJlc2g6ICgpID0+IHRoaXMuX3JlZnJlc2hTdWJqLm5leHQoKSxcclxuICAgIHJlc2V0OiAoKSA9PiB0aGlzLmV4ZWN1dGVTZWFyY2gubmV4dCh0cnVlKSxcclxuXHJcbiAgICBnZXRGYWNldDogKGZhY2V0UmVmKSA9PiAodGhpcy5sYXN0RmFjZXRSZXF1ZXN0IHx8IHtmYWNldHM6IHt9fSkuZmFjZXRzW2ZhY2V0UmVmXSxcclxuICAgIGl0ZW1zQ291bnQ6IDAsXHJcbiAgICBzZWxlY3RlZEl0ZW1zQ291bnQ6IDAsXHJcbiAgICBnZXRTZWxlY3RlZEl0ZW1zOiAoKTogYW55W10gPT4gT2JqZWN0LnZhbHVlcyh0aGlzLl9zZWxlY3Rpb25NYXApLFxyXG4gICAgZ2V0RmV0Y2hSZXF1ZXN0RGF0YTogKCkgPT4gdGhpcy5nZXRGZXRjaFJlcXVlc3REYXRhKClcclxuXHJcbiAgfTtcclxuXHJcblxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB3YWl0U2VydmljZTogU2lpV2FpdFNlcnZpY2Upe1xyXG4gICAgdGhpcy5mZXRjaFBhZ2Uuc3Vic2NyaWJlKChwYWdhUmVxKSA9PiB7XHJcbiAgICAgIHRoaXMuX2N1cnJlbnRwYWdlID0gcGFnYVJlcTtcclxuICAgICAgdGhpcy5leGVjdXRlU2VhcmNoLm5leHQoZmFsc2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5mYWNldHNDaGFuZ2VPYnMuc3Vic2NyaWJlKChmYWNldHNDaGFuZ2VzOiBGYWNldENoYW5nZXNEdG8pID0+IHtcclxuICAgICAgdGhpcy5sYXN0RmFjZXRSZXF1ZXN0ID0gZmFjZXRzQ2hhbmdlcztcclxuICAgICAgdGhpcy5leGVjdXRlU2VhcmNoLm5leHQodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmZhY2V0c1Jlc2V0T2JzLnN1YnNjcmliZSgoZmFjZXRzOiBGYWNldENoYW5nZXNEdG8pID0+IHtcclxuICAgICAgdGhpcy5sYXN0RmFjZXRSZXF1ZXN0ID0gZmFjZXRzO1xyXG4gICAgICB0aGlzLmV4ZWN1dGVTZWFyY2gubmV4dCh0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICB0aGlzLnNvcnRDaGFuZ2VPYnMuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5leGVjdXRlU2VhcmNoLm5leHQodHJ1ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB0aGlzLnNlYXJjaENoYW5nZU9icy5zdWJzY3JpYmUoKHR4dCk9PntcclxuICAgIC8vICAgdGhpcy5fdGV4dFNlcmNoPXR4dDtcclxuICAgIC8vICAgdGhpcy5leGVjdXRlU2VhcmNoLm5leHQodHJ1ZSk7XHJcbiAgICAvLyB9KVxyXG5cclxuXHJcbiAgICB0aGlzLmV4ZWN1dGVTZWFyY2hPYnNcclxuICAgIC5zdWJzY3JpYmUoKHJlc2V0KSA9PiB7XHJcbiAgICAgIHRoaXMuZXhlY3V0ZVNlYXJjaEZ1bmN0aW9uKHJlc2V0KTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0QXV0b3NhdmUoYXV0b3NhdmVJZDogc3RyaW5nLCBza2lwSW5pdEZhY2V0czogYm9vbGVhbil7XHJcbiAgICB0aGlzLl9hdXRvc2F2ZUlkID0gYXV0b3NhdmVJZDtcclxuICAgIGNvbnN0IGFzYXZlRGF0ZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2lpTGlzdC0nICsgdGhpcy5fYXV0b3NhdmVJZCArICdkYXRlJyk7XHJcbiAgICBpZiAoYXNhdmVEYXRlID09IG51bGwgfHwgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSkgLSBwYXJzZUludChhc2F2ZURhdGUsIDEwKSAgLSAoMSAqIDI0ICogNjAgKiA2MCAqIDEwMDApIDwgMCkpe1xyXG4gICAgICAvLyBzZSBub24gw6ggcGFzc2F0byB1biBnaW9ybm8gZGFsbCd1bHRpbW8gc2FsdmF0YWdnaW8sIHJpdXRpbGl6em8gaSBmaWx0cmkgc2FsdmF0aVxyXG4gICAgICBjb25zdCBhc2F2ZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2lpTGlzdC0nICsgdGhpcy5fYXV0b3NhdmVJZCk7XHJcbiAgICAgIGlmIChhc2F2ZSAhPSBudWxsICYmIHNraXBJbml0RmFjZXRzKSB7XHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgY29uc3QganNvbkFzYXZlID0gSlNPTi5wYXJzZShhc2F2ZSkgYXMgU2lpRmFjZXRlZFBhZ2VSZXF1ZXN0RFRPO1xyXG4gICAgICAgICAgdGhpcy5zZXRJbml0ZmFjZXRzKHtcclxuICAgICAgICAgICAgZmFjZXRzOiBqc29uQXNhdmUuc2VsZWN0ZWQsXHJcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IChqc29uQXNhdmUudGV4dFNlYXJjaCB8fCAnJyksXHJcbiAgICAgICAgICAgIHNvcnQ6IGpzb25Bc2F2ZS5zb3J0LFxyXG4gICAgICAgICAgICBncm91cDoganNvbkFzYXZlLmdyb3VwXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLl9za2lwSW5pdEZhY2V0cyA9IHRydWU7XHJcbiAgICAgICAgfWNhdGNoIChlcnIpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yZSByZWN1cGVybyBjb25maWd1cmF6aW9uZSBsaXN0YSBzYWx2YXRhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG5wcml2YXRlICBzZXRJbml0ZmFjZXRzKGluaWY6IEZhY2V0Q2hhbmdlc0R0byApe1xyXG4gIGlmICghdGhpcy5fc2tpcEluaXRGYWNldHMpe1xyXG4gICAgdGhpcy5sYXN0RmFjZXRSZXF1ZXN0ID0gaW5pZjtcclxuICAgIGlmICghIWluaWYuc29ydCl7XHJcbiAgICAgIHRoaXMuX3NvcnRGaWVsZCA9IGluaWYuc29ydDtcclxuICAgIH1cclxuICAgIGlmICghIWluaWYuZ3JvdXApe1xyXG4gICAgICB0aGlzLl9ncm91cEZpZWxkID0gaW5pZi5ncm91cDtcclxuICAgIH1cclxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICB0aGlzLnNldEluaXRGYWNldHNTdWJqLm5leHQoaW5pZik7XHJcbiAgICB9KTtcclxuICB9ZWxzZXtcclxuICAgIHRoaXMuX3NraXBJbml0RmFjZXRzID0gZmFsc2U7XHJcbiAgfVxyXG4gIH1cclxucHJpdmF0ZSBjaGFuZ2VGYWNldHMoZmFjZXRzOiBvYmplY3R8bnVsbCwgc2VhcmNoVGV4dDogc3RyaW5nfG51bGwgICwgcmVzZXRPdGhlcnM6IGJvb2xlYW4pe1xyXG4gIGlmIChmYWNldHMgIT0gbnVsbCB8fCByZXNldE90aGVycyl7XHJcbiAgICB0aGlzLmNoYW5nZUZhY2V0c1N1YmoubmV4dCh7ZmFjZXRzOiAoZmFjZXRzIHx8IHt9ICksICByZXNldDogcmVzZXRPdGhlcnN9KTtcclxuICB9XHJcblxyXG4gIGlmIChzZWFyY2hUZXh0ICE9IG51bGwgfHwgcmVzZXRPdGhlcnMpe1xyXG4gICAgdGhpcy5jaGFuZ2VTZWFyY2hUZXh0U3Viai5uZXh0KHNlYXJjaFRleHQgfHwgJycpO1xyXG4gIH1cclxufVxyXG4vLyBwcml2YXRlIGNoYW5nZVNlYXJjaFRleHQoZGF0YTogc3RyaW5nKXtcclxuLy8gICB0aGlzLmNoYW5nZVNlYXJjaFRleHRTdWJqLm5leHQoZGF0YSk7XHJcbi8vIH1cclxuXHJcbnByaXZhdGUgZ2V0RmV0Y2hSZXF1ZXN0RGF0YSA9ICgpOiBTaWlGYWNldGVkUGFnZVJlcXVlc3REVE8gPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBmZXRjaFNpemU6ICB0aGlzLl9mZXRjaFNpemUsXHJcbiAgICBwYWdlOiB0aGlzLl9jdXJyZW50cGFnZSxcclxuICAgIHN0YXJ0S2V5OnRoaXMuX2N1cnJlbnRwYWdlIT0wPyB0aGlzLl9sYXN0RXZhbHVhdGVkS2V5T2ZQYWdlW3RoaXMuX2N1cnJlbnRwYWdlLTFdIDogbnVsbCxcclxuICAgIHNlbGVjdGVkOiB0aGlzLmxhc3RGYWNldFJlcXVlc3QuZmFjZXRzICxcclxuICAgIHNvcnQ6IHRoaXMuX3NvcnRGaWVsZCxcclxuICAgIGdyb3VwOiB0aGlzLl9ncm91cEZpZWxkLFxyXG4gICAgdGV4dFNlYXJjaDogKHRoaXMubGFzdEZhY2V0UmVxdWVzdC5zZWFyY2hUZXh0Lmxlbmd0aCA9PT0gMCA/IG51bGwgOiB0aGlzLmxhc3RGYWNldFJlcXVlc3Quc2VhcmNoVGV4dClcclxuICAgICAgfSBhcyBTaWlGYWNldGVkUGFnZVJlcXVlc3REVE87XHJcbn1cclxuXHJcbiAgcHJpdmF0ZSBleGVjdXRlU2VhcmNoRnVuY3Rpb24ocmVzZXQ9IGZhbHNlKXtcclxuICAgIGlmIChyZXNldCl7XHJcbiAgICAgIHRoaXMuX2N1cnJlbnRwYWdlID0gMDtcclxuICAgICAgdGhpcy5kZXNlbGVjdEFsbCgpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRGZXRjaENhbGwuZm9yRWFjaChpPT5pLnVuc3Vic2NyaWJlKCkpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRGZXRjaENhbGwubGVuZ3RoPT0wO1xyXG4gICAgICB0aGlzLnNlbWFwaG9yZUZldGNoPTA7XHJcbiAgICAgIHRoaXMuaGlkZUZldGNoU3Bpbm5lcigpXHJcbiAgICB9XHJcbiAgICBjb25zdCBwYWdlID0gdGhpcy5fY3VycmVudHBhZ2U7XHJcbiAgICBjb25zdCBwcyA9IHRoaXMuX2ZldGNoU2l6ZTtcclxuXHJcbiAgICBjb25zdCBmciA9IHRoaXMuZ2V0RmV0Y2hSZXF1ZXN0RGF0YSgpO1xyXG5cclxuXHJcbiAgICB0aGlzLndhaXRTZXJ2aWNlLnNraXBOZXh0KCk7XHJcbiAgICB0aGlzLnNob3dGZXRjaFNwaW5uZXIoKTtcclxuICAgIHRoaXMuY3VycmVudEZldGNoQ2FsbC5wdXNoKFxyXG4gICAgICB0aGlzLl9mZXRjaFNlcnZpY2UoZnIpXHJcbiAgICAgIC5zdWJzY3JpYmUoICggcmVzcDogU2lpRmFjZXRlZFBhZ2VSZXNwb25zZURUTzxhbnk+KSA9PiB7XHJcbiAgICAgICAgcmVzcC5yb3dzLmN1cnJQYWdlPXBhZ2U7XHJcbiAgICAgICAgcmVzcC5yb3dzLnBhZ2VTaXplPXBzO1xyXG5cclxuICAgICAgICBpZihyZXNwLnJvd3MuY291bnQ9PW51bGwpe1xyXG4gICAgICAgICAgcmVzcC5yb3dzLmNvdW50PXBzKnBhZ2UgKyAocmVzcC5yb3dzLmRhdGEgfHwgW10pLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCEhcmVzcC5yb3dzPy5sYXN0RXZhbHVhdGVkS2V5KXtcclxuICAgICAgICAgIHRoaXMuX2xhc3RFdmFsdWF0ZWRLZXlPZlBhZ2VbcGFnZV09IHJlc3Aucm93cz8ubGFzdEV2YWx1YXRlZEtleTtcclxuICAgICAgICAgIHJlc3Aucm93cy5jb3VudCs9cmVzcC5yb3dzPy5sYXN0RXZhbHVhdGVkS2V5PT1udWxsPyAwOiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXNwLnJvd3MubWF4UGFnZT0gIE1hdGguY2VpbChyZXNwLnJvd3MuY291bnQgLyBwcyk7XHJcblxyXG4gICAgICAgIGlmIChyZXNwLmZhY2V0cyAhPSBudWxsKXtcclxuICAgICAgICAgIHRoaXMuX2ZhY2V0Q2hhbmdlU3Viai5uZXh0KHJlc3AuZmFjZXRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZmV0Y2hQYWdlRGF0YVN1YmoubmV4dCh7cGFnZSwgcm93czogcmVzcC5yb3dzLCByZXNldCB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5oaWRlRmV0Y2hTcGlubmVyKCk7XHJcblxyXG4gICAgICAgIGlmICghIXRoaXMuX2F1dG9zYXZlSWQpe1xyXG4gICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzaWlMaXN0LScgKyB0aGlzLl9hdXRvc2F2ZUlkLCBKU09OLnN0cmluZ2lmeShmcikpO1xyXG4gICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzaWlMaXN0LScgKyB0aGlzLl9hdXRvc2F2ZUlkICsgJ2RhdGUnLCBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaGlkZUZldGNoU3Bpbm5lcigpIHtcclxuICAgIHRoaXMuc2VtYXBob3JlRmV0Y2gtLTtcclxuICAgIGlmICh0aGlzLnNlbWFwaG9yZUZldGNoIDwgMCApIHtcclxuICAgICAgdGhpcy5zZW1hcGhvcmVGZXRjaCA9IDA7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5zZW1hcGhvcmVGZXRjaCA9PT0gMCkge1xyXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+XHJcbiAgICAgICB0aGlzLmZldGNoSW5Qcm9ncmVzcy5uZXh0KGZhbHNlKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvd0ZldGNoU3Bpbm5lcigpIHtcclxuICAgIGlmICh0aGlzLnNlbWFwaG9yZUZldGNoID09PSAwKSB7XHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT5cclxuICAgICAgICB0aGlzLmZldGNoSW5Qcm9ncmVzcy5uZXh0KHRydWUpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnNlbWFwaG9yZUZldGNoKys7XHJcbiAgfVxyXG5cclxuXHJcbiAvLyAtLS0tLS0tLS0tc3RhcnQtLS0tLS0tLS0tLS1zZWxlY3Rpb25zXHJcblxyXG4gIG11bHRpc2VsZWN0SXRlbUNsaWNrKHNlbGVjdGVkaXRlbSl7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTWFwW3NlbGVjdGVkaXRlbVt0aGlzLl9pdGVtSWRdXSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgLy8gYWRkIGl0ZW1cclxuICAgICAgdGhpcy5fc2VsZWN0aW9uTWFwW3NlbGVjdGVkaXRlbVt0aGlzLl9pdGVtSWRdXSA9IHNlbGVjdGVkaXRlbTtcclxuICAgIH1lbHNle1xyXG4gICAgICAvLyByZW1vdmUgaXRlbVxyXG4gICAgICBkZWxldGUgdGhpcy5fc2VsZWN0aW9uTWFwW3NlbGVjdGVkaXRlbVt0aGlzLl9pdGVtSWRdXTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zQ2hhbmdlU3Viai5uZXh0KE9iamVjdC52YWx1ZXModGhpcy5fc2VsZWN0aW9uTWFwKSk7XHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvblN0YXR1cygpO1xyXG4gIH1cclxuXHJcbiAgbWFya0FzU2VsZWN0ZWQoaXRlbXM6IGFueVtdKXtcclxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgdGhpcy5fc2VsZWN0aW9uTWFwW2l0ZW1bdGhpcy5faXRlbUlkXV0gPSBpdGVtO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zQ2hhbmdlU3Viai5uZXh0KE9iamVjdC52YWx1ZXModGhpcy5fc2VsZWN0aW9uTWFwKSk7XHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvblN0YXR1cygpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlTWlzc2luZ1NlbGVjdGlvbihpdGVtczogYW55W10pe1xyXG4gICAgbGV0IHNvbWVDaGFuZ2UgPSBmYWxzZTtcclxuICAgIE9iamVjdC5rZXlzKHRoaXMuX3NlbGVjdGlvbk1hcCkuZm9yRWFjaChzZWxJdGVtSWQgPT4ge1xyXG4gICAgICBpZiAoaXRlbXMuZmlsdGVyKGUgPT4gZSAhPT0gdW5kZWZpbmVkKS5maW5kSW5kZXgoaXRlbSA9PiAnJyArIGl0ZW1bdGhpcy5faXRlbUlkXSA9PT0gJycgKyBzZWxJdGVtSWQpID09PSAtMSl7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3NlbGVjdGlvbk1hcFtzZWxJdGVtSWRdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGByaW11b3ZvIGVsZW1lbnRvICR7c2VsSXRlbUlkfSBkb3BvIGlsIHJlbG9hZGApO1xyXG4gICAgICAgIHNvbWVDaGFuZ2UgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoc29tZUNoYW5nZSl7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbXNDaGFuZ2VTdWJqLm5leHQoT2JqZWN0LnZhbHVlcyh0aGlzLl9zZWxlY3Rpb25NYXApKTtcclxuICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb25TdGF0dXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNpbmdsZXNlbGVjdEl0ZW1DbGljayhzZWxlY3RlZGl0ZW0pe1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1hcFtzZWxlY3RlZGl0ZW1bdGhpcy5faXRlbUlkXV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIC8vIGFkZCBpdGVtXHJcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1hcCA9IHt9O1xyXG4gICAgICB0aGlzLl9zZWxlY3Rpb25NYXBbc2VsZWN0ZWRpdGVtW3RoaXMuX2l0ZW1JZF1dID0gc2VsZWN0ZWRpdGVtO1xyXG4gICAgICB0aGlzLl9zZWxlY3RlZEl0ZW1DaGFuZ2VTdWJqLm5leHQodGhpcy5fc2VsZWN0aW9uTWFwW3NlbGVjdGVkaXRlbVt0aGlzLl9pdGVtSWRdXSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgLy8gcmVtb3ZlIGl0ZW1cclxuICAgICAgdGhpcy5fc2VsZWN0aW9uTWFwID0ge307XHJcbiAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbUNoYW5nZVN1YmoubmV4dChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zQ2hhbmdlU3Viai5uZXh0KE9iamVjdC52YWx1ZXModGhpcy5fc2VsZWN0aW9uTWFwKSk7XHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvblN0YXR1cygpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVTZWxlY3Rpb25TdGF0dXMoKXtcclxuICAgIHRoaXMuYXBpLnNlbGVjdGVkSXRlbXNDb3VudCA9IE9iamVjdC52YWx1ZXModGhpcy5fc2VsZWN0aW9uTWFwKS5sZW5ndGg7XHJcbiAgICBzd2l0Y2ggKHRoaXMuYXBpLnNlbGVjdGVkSXRlbXNDb3VudCl7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb25TdGF0dXMgPSAnTic7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgdGhpcy5sYXN0RmV0Y2hSZXF1ZXN0SW5mby5jb3VudDpcclxuICAgICAgICAgdGhpcy5fc2VsZWN0aW9uU3RhdHVzID0gJ0EnO1xyXG4gICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgdGhpcy5fc2VsZWN0aW9uU3RhdHVzID0gJ1AnO1xyXG4gICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgaXNTZWxlY3RlZCA9IChpdGVtKTogYm9vbGVhbiA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uTWFwW2l0ZW1bdGhpcy5faXRlbUlkXV0gIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIGdldCBzZWxlY3Rpb25TdGF0dXMoKTogc2VsZWN0aW9uU3RhdHVzVHlwZXtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25TdGF0dXM7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RBbGwoKXtcclxuICAgIC8vIHNlIGNpIHNvbm8gdHJvcHBpIGVsZW1lbnRpIG5vbiBwb3NzbyBmYXJlIGxhIHNlbGV6aW9uZVxyXG4gICAgLy8gdG9kb1xyXG4gICAgaWYgKHRoaXMubGFzdEZldGNoUmVxdWVzdEluZm8uY291bnQgPiB0aGlzLl9tYXhGZXRjaFNpemUpe1xyXG4gICAgICBhbGVydCgndHJvcHBpIGVsZW1lbnRpJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX3NlbGVjdEFsbFN1YmoubmV4dCgpO1xyXG4gIH1cclxuXHJcbiAgZGVzZWxlY3RBbGwoKXtcclxuICAgIHRoaXMuX3NlbGVjdGlvbk1hcCA9IHt9O1xyXG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtc0NoYW5nZVN1YmoubmV4dChbXSk7XHJcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1DaGFuZ2VTdWJqLm5leHQobnVsbCk7XHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvblN0YXR1cygpO1xyXG4gIH1cclxuLy8gLS0tLS0tLS0tLS1lbmQtLS0tLS0tLS0tLXNlbGVjdGlvbnNcclxuXHJcbn1cclxuXHJcbiJdfQ==