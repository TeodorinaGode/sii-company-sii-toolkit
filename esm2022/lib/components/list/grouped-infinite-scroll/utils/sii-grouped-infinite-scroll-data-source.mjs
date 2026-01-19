import { BehaviorSubject, Subscription, from, zip, of } from 'rxjs';
import { filter, groupBy, mergeMap, toArray } from 'rxjs/operators';
export class SiiGroupedInfiniteScrollDataSource {
    get data() { return this._dataStream; }
    get dataValue() { return this._dataStream.value; }
    get fetchSize() {
        return this.siiListController._fetchSize;
    }
    get listSize() {
        return this._cachedData.length;
    }
    get displayedListSize() {
        return this._displayedData.length;
    }
    get visibleGroups() {
        return this.utils.groups.byVisiblePos;
    }
    get bySiiId() {
        return this.utils.groups.bySiiId;
    }
    constructor(siiListController, ref) {
        this.siiListController = siiListController;
        this.ref = ref;
        this.utils = {
            lastRequestedPage: undefined,
            groups: { byKey: {}, byRealPos: {}, byVisiblePos: {}, byParentGroupKey: {}, bySiiId: {} },
            collapsedGroup: [],
            collapsedParentGroup: {},
            itemsToFetchAfterCollapse: undefined,
            selectAllFetchedPage: undefined
        };
        this.lastFetchedpage = -1;
        this._cachedData = [];
        this._displayedData = Array.from({ length: this.fetchSize });
        this._dataStream = new BehaviorSubject(this._cachedData);
        this._subscription = new Subscription();
        this.listChangeSubscriptionFunction = (page, res, reset) => {
            // console.log(`listChangeSubscriptionFunction - ${page}`)
            if (reset) {
                this._cachedData = [];
                this.lastFetchedpage = page;
                this.utils.collapsedGroup.length = 0;
                this.utils.collapsedParentGroup = {};
            }
            // if(reset || res.count> this._cachedData.length){
            //   this._cachedData.length= res.count
            // }
            // console.log(`page: ${page} -> splice(${page*this.fetchSize},${res.data.length}, data)   -> dataLength=${this._cachedData.length}`)
            this.fillCachedData(page * this.fetchSize);
            let idTime = new Date().getTime();
            this._cachedData.splice(page * this.fetchSize, res.data.length, ...res.data.map(d => ({ ...d, ...{ _siiId: idTime++ } })));
            // console.log( `dataLength=${this._cachedData.length}` )
            this.buildGroups();
            this.siiListController.lastFetchRequestInfo = { ...res, data: null };
        };
        this.fillCachedData = (toIndex) => {
            for (let i = 0; i < toIndex; i++) {
                if (!this._cachedData[i]) {
                    this._cachedData[i] = undefined;
                }
            }
        };
        this._subscription.add(siiListController.fetchPageData.subscribe((resp) => {
            this.listChangeSubscriptionFunction(resp.page, resp.rows, resp.reset);
            this.fetchItemsAfterCollapse();
            this.checkForSelectAll(resp.page);
        }));
        this._subscription.add(siiListController.selectAllObs.subscribe((resp) => this.selectAllSubscriptionFunction()));
        this._subscription.add(siiListController.refreshObs.subscribe((resp) => this.refreshSubscriptionFunction()));
    }
    fetchNextPage() {
        this._fetchPage(this.lastFetchedpage + 1);
    }
    get haveCollapsedGroups() {
        return this.utils.collapsedGroup.length > 0;
    }
    isGroupCollapsed(key) {
        return this.utils.collapsedGroup.indexOf(key) !== -1;
    }
    isParentGroupCollapsed(key) {
        return !!this.utils.collapsedParentGroup[key];
    }
    parentGroupSize(key) {
        return this.utils.groups.byParentGroupKey[key].reduce((a, g) => a + g.length, 0);
    }
    _fetchPage(page) {
        // if (this._fetchedPages.has(page)) {
        //   return;
        // }
        if (page === 0 || page < this.siiListController.lastFetchRequestInfo.maxPage) {
            this.lastFetchedpage = page;
            // console.log(`_fetchPage ${page}`, this._fetchedPages);
            this.siiListController.doFetchPage.next(page);
        }
        else {
            // console.log('NO MORE PAGES')
        }
    }
    buildData() {
        this.utils.groups.byVisiblePos = {};
        // recupero la dimensione degli elementi collassati
        const collapsedDim = this.utils.collapsedGroup.map(cg => this.utils.groups.byKey[cg]?.length).reduce((a, i) => { a += i; return a; }, 0);
        const newData = Array.from({ length: this._cachedData.length - collapsedDim });
        const grPosArr = Object.keys(this.utils.groups.byRealPos);
        let collapsedItemCount = 0;
        for (const grPos of grPosArr) {
            const currGr = this.utils.groups.byRealPos[grPos];
            if (this.utils.collapsedGroup.findIndex(k => k === currGr.key) !== -1) {
                // se il gruppo  è collassato aggiungo solo in puntatore
                this.addGroupPointer(currGr.firstItem - collapsedItemCount, currGr);
                collapsedItemCount += currGr.length;
            }
            else {
                // aggiungo gli elementi in base alla loro posizione rispetto al gruppo
                this.addGroupPointer((+grPos - collapsedItemCount), currGr);
                for (let z = 0, j = +grPos; z < currGr.length; j++, z++) {
                    newData[j - collapsedItemCount] = currGr.items[z];
                }
            }
        }
        this._displayedData = newData;
        this._dataStream.next(this._displayedData);
        this.ref.markForCheck();
        this.ref.detectChanges();
    }
    addGroupPointer(pos, item) {
        if (this.utils.groups.byVisiblePos[pos] === undefined) {
            this.utils.groups.byVisiblePos[pos] = [];
        }
        this.utils.groups.byVisiblePos[pos].push(item);
    }
    getGroupKey(record) {
        return record[this.siiListController._groupField.groupKey] + (!!this.siiListController._groupField.parentGroupKey ? record[this.siiListController._groupField.parentGroupKey] : '');
    }
    buildGroups() {
        const groups = [];
        if (!this.siiListController._groupField.groupKey) {
            groups.push({
                label: undefined,
                items: this._cachedData,
                key: '##NOGROUP##',
                firstItem: 0,
                lastItem: this._cachedData.length - 1,
                length: this._cachedData.length
            });
        }
        else {
            from(this._cachedData)
                .pipe(filter(r => r !== undefined), groupBy(record => this.getGroupKey(record), p => p), mergeMap(group => zip(of(group.key), group.pipe(toArray()))))
                .subscribe((res) => {
                const parentGroupKey = !!this.siiListController._groupField.parentGroupKey ? res[1][0][this.siiListController._groupField.parentGroupKey] : null;
                const gta = {
                    key: (parentGroupKey || '') + res[1][0][this.siiListController._groupField.groupKey],
                    label: res[1][0][this.siiListController._groupField.groupValue],
                    groupKey: res[1][0][this.siiListController._groupField.groupKey],
                    items: res[1],
                    firstItem: this._cachedData.indexOf(res[1][0]),
                    lastItem: this._cachedData.indexOf(res[1][res[1].length - 1]),
                    length: res[1].length,
                    parentGroupKey,
                    parentGroupValue: !!this.siiListController._groupField.parentGroupValue ? res[1][0][this.siiListController._groupField.parentGroupValue] : null,
                    parentGroupLabelTransform: this.siiListController._groupField.parentGroupLabelTransform,
                    groupLabelTransform: this.siiListController._groupField.groupLabelTransform,
                    groupAction: this.siiListController._groupField.groupAction,
                    parentGroupAction: this.siiListController._groupField.parentGroupAction
                };
                if (!!this.siiListController._groupField.parentGroupKey && (groups.length === 0 || groups[groups.length - 1].parentGroupKey !== gta.parentGroupKey)) {
                    gta.isFirstOfparentGroup = true;
                }
                groups.push(gta);
            });
        }
        this.utils.groups.byKey = groups.reduce((a, i) => { a[i.key] = i; return a; }, {});
        this.utils.groups.byRealPos = groups.reduce((a, i) => { a[i.firstItem] = i; return a; }, {});
        this.utils.groups.bySiiId = groups.reduce((a, i) => { i.items.forEach(el => a[el._siiId] = i); return a; }, {});
        // groups.forEach((g) => {
        //   for (let i = g.firstItem; i <= g.lastItem; i++){
        //     this.utils.groups.byRowIndex[i] = g;
        //   }
        // });
        if (!!this.siiListController._groupField.parentGroupKey) {
            this.utils.groups.byParentGroupKey = {};
            groups.forEach((g) => {
                if (!this.utils.groups.byParentGroupKey[g.parentGroupKey]) {
                    this.utils.groups.byParentGroupKey[g.parentGroupKey] = [];
                }
                this.utils.groups.byParentGroupKey[g.parentGroupKey].push(g);
                if (this.utils.collapsedParentGroup.hasOwnProperty(g.parentGroupKey) && !this.isGroupCollapsed(g.key)) {
                    this.toggleGroup(g);
                }
            });
            // console.log('build groups', this.utils.groups.byParentGroupKey);
        }
        this.buildData();
    }
    toggleparentGroup(parentGroupId) {
        if (!this.utils.collapsedParentGroup.hasOwnProperty(parentGroupId)) {
            // collasso il gruppo
            this.utils.collapsedParentGroup[parentGroupId] = true;
            this.utils.groups.byParentGroupKey[parentGroupId].forEach(g => {
                if (!this.isGroupCollapsed(g.key)) {
                    this.toggleGroup(g);
                }
            });
        }
        else {
            delete this.utils.collapsedParentGroup[parentGroupId];
        }
    }
    toggleGroup(group) {
        const gk = this.utils.collapsedGroup.findIndex(k => group.key === k);
        if (gk === -1) {
            // collasso il gruppo
            this.utils.collapsedGroup.push(group.key);
            this.utils.itemsToFetchAfterCollapse = {
                size: group.length,
                group: group.key
            };
            this.fetchItemsAfterCollapse();
        }
        else {
            // rimuovo collasso
            this.utils.collapsedGroup.splice(gk, 1);
        }
        this.buildData();
    }
    fetchItemsAfterCollapse() {
        if (this.utils.itemsToFetchAfterCollapse !== undefined) {
            let allLoaded = true;
            const group = this.utils.groups.byKey[this.utils.itemsToFetchAfterCollapse.group];
            // for(let i=group.lastItem+1;i<Math.min(this._cachedData.length,(group.lastItem+this.utils.itemsToFetchAfterCollapse.size+1));i++){
            for (let i = group.lastItem + 1; i < Math.min(this.siiListController.api.itemsCount, (group.lastItem + this.utils.itemsToFetchAfterCollapse.size + 1)); i++) {
                if (this._cachedData[i] === undefined) {
                    allLoaded = false;
                    break;
                }
            }
            if (allLoaded) {
                this.utils.itemsToFetchAfterCollapse = undefined;
            }
            else {
                this.fetchNextPage();
            }
        }
    }
    refreshSubscriptionFunction() {
        // const pages=[...this._fetchedPages];
        // this._fetchedPages.clear();
        const pages = [];
        this._cachedData.length = 0;
        const lfp = this.lastFetchedpage;
        this.lastFetchedpage = -1;
        for (let i = 0; i <= lfp; i++) {
            pages.push(i);
            this._fetchPage(i);
        }
        // pages.forEach((page)=>{
        //   // console.log(`refresh page ${page}`)
        //   this._fetchPage(page)
        // })
        // dopo che ho caricato tutte le pagine, deseleziono gli elementi che non sono più presenti
        // mi metto quindi in ascolto per intercettare le response di tutte le pagine, e alla fine faccio l'operazione
        const fetchSubsc = this.siiListController.fetchPageData.subscribe((resp) => {
            pages.splice(pages.indexOf(resp.page), 1);
            if (pages.length === 0) {
                fetchSubsc.unsubscribe();
                Promise.resolve().then(() => {
                    this.siiListController.removeMissingSelection(this._cachedData);
                });
            }
        });
    }
    selectAllSubscriptionFunction() {
        const loadedItem = this._cachedData.reduce((acc, i) => {
            acc += i === undefined ? 0 : 1;
            return acc;
        }, 0);
        // se ho tutti gli elementi
        if (loadedItem === this.siiListController.lastFetchRequestInfo.count) {
            this.siiListController.markAsSelected(this._cachedData);
        }
        else {
            this.siiListController.selectAllInProgress = true;
            const newData = Array.from({ length: this.siiListController.api.itemsCount });
            this._cachedData.forEach((cd, index) => newData[index] = cd);
            this._cachedData = newData;
            for (let i = 0; i < this.siiListController.lastFetchRequestInfo.maxPage; i++) {
                if (i > this.lastFetchedpage) {
                    this._fetchPage(i);
                    if (this.utils.selectAllFetchedPage === undefined) {
                        this.utils.selectAllFetchedPage = [];
                    }
                    this.utils.selectAllFetchedPage.push(i);
                }
            }
        }
    }
    checkForSelectAll(page) {
        // console.log(`checkForSelectAll -> ${page}` ,this.selectAllFetchedPage)
        if (this.utils.selectAllFetchedPage !== undefined) {
            this.utils.selectAllFetchedPage.splice(this.utils.selectAllFetchedPage.indexOf(page), 1);
            if (this.utils.selectAllFetchedPage.length === 0) {
                this.utils.selectAllFetchedPage = undefined;
                this.siiListController.markAsSelected(this._cachedData);
                this.siiListController.selectAllInProgress = false;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lpLWdyb3VwZWQtaW5maW5pdGUtc2Nyb2xsLWRhdGEtc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lpLXRvb2xraXQvc3JjL2xpYi9jb21wb25lbnRzL2xpc3QvZ3JvdXBlZC1pbmZpbml0ZS1zY3JvbGwvdXRpbHMvc2lpLWdyb3VwZWQtaW5maW5pdGUtc2Nyb2xsLWRhdGEtc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBYyxlQUFlLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBR2hGLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQW1CcEUsTUFBTSxPQUFPLGtDQUFrQztJQUU3QyxJQUFJLElBQUksS0FBSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLElBQUksU0FBUyxLQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRWpELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSSxpQkFBaUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDeEMsQ0FBQztJQUNELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxD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QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBRUwsQ0FBQztJQUVELGlCQUFpQixDQUFDLElBQUk7UUFDcEIseUVBQXlFO1FBQ3pFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsS0FBSyxTQUFTLEVBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6RixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7WUFDckQsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb2xsZWN0aW9uVmlld2VyLCBEYXRhU291cmNlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24sIGZyb20sIHppcCwgb2YgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgU2lpTGlzdENvbnRyb2xsZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlL3NpaS1saXN0LWNvbnRyb2xsZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IElTaWlQYWdlUmVzcG9uc2VEVE8gfSBmcm9tICcuLi8uLi8uLi8uLi9kdG8vaS1zaWktcGFnZS1yZXNwb25zZS5kdG8nO1xyXG5pbXBvcnQgeyBmaWx0ZXIsIGdyb3VwQnksIG1lcmdlTWFwLCB0b0FycmF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTb3J0ZXJHcm91cEFjdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbXBvbmVudHMvbGlzdC1zb3J0ZXIvbGlzdC1zb3J0ZXItb3B0aW9uL2xpc3Qtc29ydGVyLW9wdGlvbi5jb21wb25lbnQnO1xyXG5leHBvcnQgdHlwZSBDaXNHcm91cD0ge1xyXG4gIGl0ZW1zOiBhbnksXHJcbiAgbGFiZWw6IHN0cmluZyxcclxuICBrZXk6IHN0cmluZyxcclxuICBmaXJzdEl0ZW06IG51bWJlcixcclxuICBsYXN0SXRlbTogbnVtYmVyLFxyXG4gIGxlbmd0aDogbnVtYmVyLFxyXG4gIHBhcmVudEdyb3VwS2V5PzogYW55LFxyXG4gIHBhcmVudEdyb3VwVmFsdWU/OiBhbnksXHJcbiAgaXNGaXJzdE9mcGFyZW50R3JvdXA/OiBib29sZWFuLFxyXG4gIHBhcmVudEdyb3VwTGFiZWxUcmFuc2Zvcm0/OiAocmlkOiBhbnksIHZhbHVlOiBhbnksIG9iajogYW55KSA9PiBzdHJpbmcsXHJcbiAgZ3JvdXBMYWJlbFRyYW5zZm9ybT86IChyaWQ6IGFueSwgdmFsdWU6IGFueSwgb2JqOiBhbnkpID0+IHN0cmluZyxcclxuICBncm91cEFjdGlvbj86IFNvcnRlckdyb3VwQWN0aW9uW11cclxuICBwYXJlbnRHcm91cEFjdGlvbj86IFNvcnRlckdyb3VwQWN0aW9uW11cclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBTaWlHcm91cGVkSW5maW5pdGVTY3JvbGxEYXRhU291cmNlICB7XHJcblxyXG4gIGdldCBkYXRhKCl7IHJldHVybiB0aGlzLl9kYXRhU3RyZWFtOyB9XHJcbiAgZ2V0IGRhdGFWYWx1ZSgpeyByZXR1cm4gdGhpcy5fZGF0YVN0cmVhbS52YWx1ZTsgfVxyXG5cclxuICBnZXQgZmV0Y2hTaXplKCl7XHJcbiAgICByZXR1cm4gdGhpcy5zaWlMaXN0Q29udHJvbGxlci5fZmV0Y2hTaXplO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxpc3RTaXplKCl7XHJcbiAgICByZXR1cm4gdGhpcy5fY2FjaGVkRGF0YS5sZW5ndGg7XHJcbiAgfVxyXG5cclxuICBnZXQgZGlzcGxheWVkTGlzdFNpemUoKXtcclxuICAgIHJldHVybiB0aGlzLl9kaXNwbGF5ZWREYXRhLmxlbmd0aDtcclxuICB9XHJcblxyXG4gIGdldCB2aXNpYmxlR3JvdXBzKCl7XHJcbiAgICByZXR1cm4gdGhpcy51dGlscy5ncm91cHMuYnlWaXNpYmxlUG9zO1xyXG4gIH1cclxuICBnZXQgYnlTaWlJZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMudXRpbHMuZ3JvdXBzLmJ5U2lpSWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHV0aWxzID0ge1xyXG4gICAgbGFzdFJlcXVlc3RlZFBhZ2U6IHVuZGVmaW5lZCxcclxuICAgIGdyb3Vwczoge2J5S2V5OiB7fSwgYnlSZWFsUG9zOiB7fSwgYnlWaXNpYmxlUG9zOiB7fSwgYnlQYXJlbnRHcm91cEtleToge30sIGJ5U2lpSWQ6IHt9fSxcclxuICAgIGNvbGxhcHNlZEdyb3VwOiBbXSxcclxuICAgIGNvbGxhcHNlZFBhcmVudEdyb3VwOiB7fSxcclxuICAgIGl0ZW1zVG9GZXRjaEFmdGVyQ29sbGFwc2U6IHVuZGVmaW5lZCxcclxuICAgIHNlbGVjdEFsbEZldGNoZWRQYWdlOiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBwcml2YXRlIGxhc3RGZXRjaGVkcGFnZSA9IC0xO1xyXG4gIHByaXZhdGUgX2NhY2hlZERhdGEgPSAgW107XHJcbiAgcHJpdmF0ZSBfZGlzcGxheWVkRGF0YSA9IEFycmF5LmZyb208b2JqZWN0Pih7bGVuZ3RoOiB0aGlzLmZldGNoU2l6ZX0pO1xyXG4gIHByaXZhdGUgX2RhdGFTdHJlYW0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PChvYmplY3QgfCB1bmRlZmluZWQpW10+KHRoaXMuX2NhY2hlZERhdGEpO1xyXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKCAgcHVibGljIHNpaUxpc3RDb250cm9sbGVyOiBTaWlMaXN0Q29udHJvbGxlciwgcHJpdmF0ZSByZWY6IENoYW5nZURldGVjdG9yUmVmKXtcclxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbi5hZGQoXHJcbiAgICAgIHNpaUxpc3RDb250cm9sbGVyLmZldGNoUGFnZURhdGEuc3Vic2NyaWJlKChyZXNwKSA9PiB7XHJcbiAgICAgICAgdGhpcy5saXN0Q2hhbmdlU3Vic2NyaXB0aW9uRnVuY3Rpb24ocmVzcC5wYWdlLCByZXNwLnJvd3MsIHJlc3AucmVzZXQpO1xyXG4gICAgICAgIHRoaXMuZmV0Y2hJdGVtc0FmdGVyQ29sbGFwc2UoKTtcclxuICAgICAgICB0aGlzLmNoZWNrRm9yU2VsZWN0QWxsKHJlc3AucGFnZSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gICAgdGhpcy5fc3Vic2NyaXB0aW9uLmFkZChcclxuICAgICAgc2lpTGlzdENvbnRyb2xsZXIuc2VsZWN0QWxsT2JzLnN1YnNjcmliZSgocmVzcCkgPT4gdGhpcy5zZWxlY3RBbGxTdWJzY3JpcHRpb25GdW5jdGlvbigpIClcclxuICAgICk7XHJcbiAgICB0aGlzLl9zdWJzY3JpcHRpb24uYWRkKFxyXG4gICAgICBzaWlMaXN0Q29udHJvbGxlci5yZWZyZXNoT2JzLnN1YnNjcmliZSgocmVzcCkgPT4gdGhpcy5yZWZyZXNoU3Vic2NyaXB0aW9uRnVuY3Rpb24oKSApXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZmV0Y2hOZXh0UGFnZSgpe1xyXG4gICAgdGhpcy5fZmV0Y2hQYWdlKHRoaXMubGFzdEZldGNoZWRwYWdlICsgMSk7XHJcbiAgfVxyXG5cclxuICBnZXQgaGF2ZUNvbGxhcHNlZEdyb3Vwcygpe1xyXG4gICAgcmV0dXJuIHRoaXMudXRpbHMuY29sbGFwc2VkR3JvdXAubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIGlzR3JvdXBDb2xsYXBzZWQoa2V5KTogYm9vbGVhbntcclxuICAgIHJldHVybiB0aGlzLnV0aWxzLmNvbGxhcHNlZEdyb3VwLmluZGV4T2Yoa2V5KSAhPT0gLTE7XHJcbiAgfVxyXG5cclxuICBpc1BhcmVudEdyb3VwQ29sbGFwc2VkKGtleSk6IGJvb2xlYW57XHJcbiAgICByZXR1cm4gISF0aGlzLnV0aWxzLmNvbGxhcHNlZFBhcmVudEdyb3VwW2tleV07XHJcbiAgfVxyXG5cclxuICBwYXJlbnRHcm91cFNpemUoa2V5KTogbnVtYmVye1xyXG4gICAgcmV0dXJuIHRoaXMudXRpbHMuZ3JvdXBzLmJ5UGFyZW50R3JvdXBLZXlba2V5XS5yZWR1Y2UoKGEsIGcpID0+IGEgKyBnLmxlbmd0aCwgMCApO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICBwcml2YXRlIF9mZXRjaFBhZ2UocGFnZTogbnVtYmVyKSB7XHJcbiAgICAvLyBpZiAodGhpcy5fZmV0Y2hlZFBhZ2VzLmhhcyhwYWdlKSkge1xyXG4gICAgLy8gICByZXR1cm47XHJcbiAgICAvLyB9XHJcbiAgICBpZiAocGFnZSA9PT0gMCB8fCBwYWdlIDwgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5sYXN0RmV0Y2hSZXF1ZXN0SW5mby5tYXhQYWdlKXtcclxuICAgICAgdGhpcy5sYXN0RmV0Y2hlZHBhZ2UgPSBwYWdlO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhgX2ZldGNoUGFnZSAke3BhZ2V9YCwgdGhpcy5fZmV0Y2hlZFBhZ2VzKTtcclxuICAgICAgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5kb0ZldGNoUGFnZS5uZXh0KHBhZ2UpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdOTyBNT1JFIFBBR0VTJylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxpc3RDaGFuZ2VTdWJzY3JpcHRpb25GdW5jdGlvbiA9IChwYWdlOiBudW1iZXIgLCByZXM6IElTaWlQYWdlUmVzcG9uc2VEVE88YW55PiwgcmVzZXQ6IGJvb2xlYW4pID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKGBsaXN0Q2hhbmdlU3Vic2NyaXB0aW9uRnVuY3Rpb24gLSAke3BhZ2V9YClcclxuICAgIGlmIChyZXNldCl7XHJcbiAgICAgIHRoaXMuX2NhY2hlZERhdGEgPSBbXTtcclxuICAgICAgdGhpcy5sYXN0RmV0Y2hlZHBhZ2UgPSBwYWdlO1xyXG4gICAgICB0aGlzLnV0aWxzLmNvbGxhcHNlZEdyb3VwLmxlbmd0aCA9IDA7XHJcbiAgICAgIHRoaXMudXRpbHMuY29sbGFwc2VkUGFyZW50R3JvdXAgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpZihyZXNldCB8fCByZXMuY291bnQ+IHRoaXMuX2NhY2hlZERhdGEubGVuZ3RoKXtcclxuICAgIC8vICAgdGhpcy5fY2FjaGVkRGF0YS5sZW5ndGg9IHJlcy5jb3VudFxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKGBwYWdlOiAke3BhZ2V9IC0+IHNwbGljZSgke3BhZ2UqdGhpcy5mZXRjaFNpemV9LCR7cmVzLmRhdGEubGVuZ3RofSwgZGF0YSkgICAtPiBkYXRhTGVuZ3RoPSR7dGhpcy5fY2FjaGVkRGF0YS5sZW5ndGh9YClcclxuICAgIHRoaXMuZmlsbENhY2hlZERhdGEocGFnZSAqIHRoaXMuZmV0Y2hTaXplKTtcclxuICAgIGxldCBpZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIHRoaXMuX2NhY2hlZERhdGEuc3BsaWNlKHBhZ2UgKiB0aGlzLmZldGNoU2l6ZSwgcmVzLmRhdGEubGVuZ3RoLCAuLi5yZXMuZGF0YS5tYXAoZCA9PiAoIHsuLi5kLCAuLi57IF9zaWlJZDogaWRUaW1lKysgfSB9ICkgKSApIDtcclxuICAgIC8vIGNvbnNvbGUubG9nKCBgZGF0YUxlbmd0aD0ke3RoaXMuX2NhY2hlZERhdGEubGVuZ3RofWAgKVxyXG4gICAgdGhpcy5idWlsZEdyb3VwcygpO1xyXG4gICAgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5sYXN0RmV0Y2hSZXF1ZXN0SW5mbyA9IHsuLi5yZXMsIGRhdGE6IG51bGwgfTtcclxuICB9XHJcblxyXG4gIGZpbGxDYWNoZWREYXRhID0gKHRvSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b0luZGV4OyBpKyspe1xyXG4gICAgICBpZiAoIXRoaXMuX2NhY2hlZERhdGFbaV0pe1xyXG4gICAgICAgIHRoaXMuX2NhY2hlZERhdGFbaV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGJ1aWxkRGF0YSgpe1xyXG4gICAgdGhpcy51dGlscy5ncm91cHMuYnlWaXNpYmxlUG9zID0ge307XHJcblxyXG4gICAgLy8gcmVjdXBlcm8gbGEgZGltZW5zaW9uZSBkZWdsaSBlbGVtZW50aSBjb2xsYXNzYXRpXHJcbiAgICBjb25zdCBjb2xsYXBzZWREaW0gPSB0aGlzLnV0aWxzLmNvbGxhcHNlZEdyb3VwLm1hcChjZyA9PiB0aGlzLnV0aWxzLmdyb3Vwcy5ieUtleVtjZ10/Lmxlbmd0aCkucmVkdWNlKChhLCBpKSA9PiB7YSArPSBpOyByZXR1cm4gYTsgfSwgMCk7XHJcbiAgICBjb25zdCBuZXdEYXRhID0gQXJyYXkuZnJvbTxvYmplY3Q+KHtsZW5ndGg6IHRoaXMuX2NhY2hlZERhdGEubGVuZ3RoIC0gY29sbGFwc2VkRGltfSk7XHJcblxyXG4gICAgY29uc3QgZ3JQb3NBcnIgPSBPYmplY3Qua2V5cyh0aGlzLnV0aWxzLmdyb3Vwcy5ieVJlYWxQb3MpO1xyXG4gICAgbGV0IGNvbGxhcHNlZEl0ZW1Db3VudCA9IDA7XHJcbiAgICBmb3IgKCBjb25zdCBnclBvcyBvZiBnclBvc0Fycil7XHJcbiAgICAgIGNvbnN0IGN1cnJHciA9IHRoaXMudXRpbHMuZ3JvdXBzLmJ5UmVhbFBvc1tnclBvc107XHJcbiAgICAgIGlmICh0aGlzLnV0aWxzLmNvbGxhcHNlZEdyb3VwLmZpbmRJbmRleChrID0+IGsgPT09IGN1cnJHci5rZXkpICE9PSAtMSl7XHJcbiAgICAgICAgLy8gc2UgaWwgZ3J1cHBvICDDqCBjb2xsYXNzYXRvIGFnZ2l1bmdvIHNvbG8gaW4gcHVudGF0b3JlXHJcbiAgICAgICAgdGhpcy5hZGRHcm91cFBvaW50ZXIoY3VyckdyLmZpcnN0SXRlbSAtIGNvbGxhcHNlZEl0ZW1Db3VudCwgY3VyckdyKTtcclxuICAgICAgICBjb2xsYXBzZWRJdGVtQ291bnQgKz0gY3VyckdyLmxlbmd0aDtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgLy8gYWdnaXVuZ28gZ2xpIGVsZW1lbnRpIGluIGJhc2UgYWxsYSBsb3JvIHBvc2l6aW9uZSByaXNwZXR0byBhbCBncnVwcG9cclxuICAgICAgICB0aGlzLmFkZEdyb3VwUG9pbnRlcigoK2dyUG9zIC0gY29sbGFwc2VkSXRlbUNvdW50KSwgY3VyckdyKTtcclxuICAgICAgICBmb3IgKGxldCB6ID0gMCwgaiA9ICtnclBvczsgeiA8IGN1cnJHci5sZW5ndGg7IGorKywgeisrICl7XHJcbiAgICAgICAgICBuZXdEYXRhW2ogLSBjb2xsYXBzZWRJdGVtQ291bnRdID0gY3VyckdyLml0ZW1zW3pdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5fZGlzcGxheWVkRGF0YSA9IG5ld0RhdGE7XHJcbiAgICB0aGlzLl9kYXRhU3RyZWFtLm5leHQodGhpcy5fZGlzcGxheWVkRGF0YSk7XHJcbiAgICB0aGlzLnJlZi5tYXJrRm9yQ2hlY2soKTtcclxuICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcclxuICB9XHJcblxyXG4gICBhZGRHcm91cFBvaW50ZXIocG9zOiBudW1iZXIsIGl0ZW0pIHtcclxuICAgICBpZiAodGhpcy51dGlscy5ncm91cHMuYnlWaXNpYmxlUG9zW3Bvc10gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgIHRoaXMudXRpbHMuZ3JvdXBzLmJ5VmlzaWJsZVBvc1twb3NdID0gW107XHJcbiAgICAgfVxyXG4gICAgIHRoaXMudXRpbHMuZ3JvdXBzLmJ5VmlzaWJsZVBvc1twb3NdLnB1c2goaXRlbSk7XHJcbiAgIH1cclxuXHJcblxyXG4gICBnZXRHcm91cEtleShyZWNvcmQ6IGFueSl7XHJcbiAgICByZXR1cm4gcmVjb3JkW3RoaXMuc2lpTGlzdENvbnRyb2xsZXIuX2dyb3VwRmllbGQuZ3JvdXBLZXldICsgKCEhdGhpcy5zaWlMaXN0Q29udHJvbGxlci5fZ3JvdXBGaWVsZC5wYXJlbnRHcm91cEtleSA/IHJlY29yZFt0aGlzLnNpaUxpc3RDb250cm9sbGVyLl9ncm91cEZpZWxkLnBhcmVudEdyb3VwS2V5XSA6ICcnKSA7ICB9XHJcblxyXG4gIGJ1aWxkR3JvdXBzKCl7XHJcbiAgICBjb25zdCBncm91cHM6IENpc0dyb3VwW10gPSBbXTtcclxuICAgIGlmICghdGhpcy5zaWlMaXN0Q29udHJvbGxlci5fZ3JvdXBGaWVsZC5ncm91cEtleSl7XHJcbiAgICAgIGdyb3Vwcy5wdXNoKHtcclxuICAgICAgICBsYWJlbDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGl0ZW1zOiB0aGlzLl9jYWNoZWREYXRhLFxyXG4gICAgICAgIGtleTogJyMjTk9HUk9VUCMjJyxcclxuICAgICAgICBmaXJzdEl0ZW06IDAsXHJcbiAgICAgICAgbGFzdEl0ZW06IHRoaXMuX2NhY2hlZERhdGEubGVuZ3RoIC0gMSxcclxuICAgICAgICBsZW5ndGg6IHRoaXMuX2NhY2hlZERhdGEubGVuZ3RoXHJcbiAgICAgIH0pO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGZyb20odGhpcy5fY2FjaGVkRGF0YSlcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgZmlsdGVyKHIgPT4gciAhPT0gdW5kZWZpbmVkKSxcclxuICAgICAgICBncm91cEJ5KHJlY29yZCA9PiB0aGlzLmdldEdyb3VwS2V5KHJlY29yZCksXHJcbiAgICAgICAgICAgICAgICBwID0+IHApLFxyXG4gICAgICAgIG1lcmdlTWFwKGdyb3VwID0+ICB6aXAob2YoZ3JvdXAua2V5KSwgZ3JvdXAucGlwZSh0b0FycmF5KCkpKSAgKVxyXG4gICAgICAgIClcclxuICAgICAgICAuc3Vic2NyaWJlKChyZXMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhcmVudEdyb3VwS2V5ID0gISF0aGlzLnNpaUxpc3RDb250cm9sbGVyLl9ncm91cEZpZWxkLnBhcmVudEdyb3VwS2V5ID8gcmVzWzFdWzBdW3RoaXMuc2lpTGlzdENvbnRyb2xsZXIuX2dyb3VwRmllbGQucGFyZW50R3JvdXBLZXldIDogbnVsbDtcclxuICAgICAgICAgIGNvbnN0IGd0YSA9IHtcclxuICAgICAgICAgICAga2V5OiAocGFyZW50R3JvdXBLZXkgfHwgJycpICsgcmVzWzFdWzBdW3RoaXMuc2lpTGlzdENvbnRyb2xsZXIuX2dyb3VwRmllbGQuZ3JvdXBLZXldLFxyXG4gICAgICAgICAgICBsYWJlbDogcmVzWzFdWzBdW3RoaXMuc2lpTGlzdENvbnRyb2xsZXIuX2dyb3VwRmllbGQuZ3JvdXBWYWx1ZV0sXHJcbiAgICAgICAgICAgIGdyb3VwS2V5OiAgcmVzWzFdWzBdW3RoaXMuc2lpTGlzdENvbnRyb2xsZXIuX2dyb3VwRmllbGQuZ3JvdXBLZXldLFxyXG4gICAgICAgICAgICBpdGVtczogcmVzWzFdLFxyXG4gICAgICAgICAgICBmaXJzdEl0ZW06IHRoaXMuX2NhY2hlZERhdGEuaW5kZXhPZihyZXNbMV1bMF0pLFxyXG4gICAgICAgICAgICBsYXN0SXRlbTogdGhpcy5fY2FjaGVkRGF0YS5pbmRleE9mKHJlc1sxXVtyZXNbMV0ubGVuZ3RoIC0gMV0pLFxyXG4gICAgICAgICAgICBsZW5ndGg6IHJlc1sxXS5sZW5ndGgsXHJcbiAgICAgICAgICAgIHBhcmVudEdyb3VwS2V5LFxyXG4gICAgICAgICAgICBwYXJlbnRHcm91cFZhbHVlOiAhIXRoaXMuc2lpTGlzdENvbnRyb2xsZXIuX2dyb3VwRmllbGQucGFyZW50R3JvdXBWYWx1ZSA/IHJlc1sxXVswXVt0aGlzLnNpaUxpc3RDb250cm9sbGVyLl9ncm91cEZpZWxkLnBhcmVudEdyb3VwVmFsdWVdIDogbnVsbCxcclxuICAgICAgICAgICAgcGFyZW50R3JvdXBMYWJlbFRyYW5zZm9ybTogdGhpcy5zaWlMaXN0Q29udHJvbGxlci5fZ3JvdXBGaWVsZC5wYXJlbnRHcm91cExhYmVsVHJhbnNmb3JtLFxyXG4gICAgICAgICAgICBncm91cExhYmVsVHJhbnNmb3JtOiB0aGlzLnNpaUxpc3RDb250cm9sbGVyLl9ncm91cEZpZWxkLmdyb3VwTGFiZWxUcmFuc2Zvcm0sXHJcbiAgICAgICAgICAgIGdyb3VwQWN0aW9uOiB0aGlzLnNpaUxpc3RDb250cm9sbGVyLl9ncm91cEZpZWxkLmdyb3VwQWN0aW9uLFxyXG4gICAgICAgICAgICBwYXJlbnRHcm91cEFjdGlvbjogdGhpcy5zaWlMaXN0Q29udHJvbGxlci5fZ3JvdXBGaWVsZC5wYXJlbnRHcm91cEFjdGlvblxyXG4gICAgICAgICAgfSBhcyBDaXNHcm91cDtcclxuICAgICAgICAgIGlmICghIXRoaXMuc2lpTGlzdENvbnRyb2xsZXIuX2dyb3VwRmllbGQucGFyZW50R3JvdXBLZXkgICYmIChncm91cHMubGVuZ3RoID09PSAwIHx8IGdyb3Vwc1tncm91cHMubGVuZ3RoIC0gMV0ucGFyZW50R3JvdXBLZXkgIT09IGd0YS5wYXJlbnRHcm91cEtleSkpe1xyXG4gICAgICAgICAgICBndGEuaXNGaXJzdE9mcGFyZW50R3JvdXAgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICBncm91cHMucHVzaChndGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB0aGlzLnV0aWxzLmdyb3Vwcy5ieUtleSA9IGdyb3Vwcy5yZWR1Y2UoKGEsIGkpID0+IHthW2kua2V5XSA9IGk7IHJldHVybiBhOyB9LCB7fSk7XHJcbiAgICB0aGlzLnV0aWxzLmdyb3Vwcy5ieVJlYWxQb3MgPSBncm91cHMucmVkdWNlKChhLCBpKSA9PiB7YVtpLmZpcnN0SXRlbV0gPSBpOyByZXR1cm4gYTsgfSwge30pO1xyXG4gICAgdGhpcy51dGlscy5ncm91cHMuYnlTaWlJZCA9IGdyb3Vwcy5yZWR1Y2UoKGEsIGkpID0+IHsgIGkuaXRlbXMuZm9yRWFjaChlbCA9PiBhWyhlbCBhcyBhbnkpLl9zaWlJZF0gPSBpICk7IHJldHVybiBhOyB9LCB7fSk7XHJcbiAgICAvLyBncm91cHMuZm9yRWFjaCgoZykgPT4ge1xyXG4gICAgLy8gICBmb3IgKGxldCBpID0gZy5maXJzdEl0ZW07IGkgPD0gZy5sYXN0SXRlbTsgaSsrKXtcclxuICAgIC8vICAgICB0aGlzLnV0aWxzLmdyb3Vwcy5ieVJvd0luZGV4W2ldID0gZztcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfSk7XHJcbiAgICBpZiAoISF0aGlzLnNpaUxpc3RDb250cm9sbGVyLl9ncm91cEZpZWxkLnBhcmVudEdyb3VwS2V5ICl7XHJcbiAgICAgIHRoaXMudXRpbHMuZ3JvdXBzLmJ5UGFyZW50R3JvdXBLZXkgPSB7fTtcclxuICAgICAgZ3JvdXBzLmZvckVhY2goKGcpID0+IHtcclxuICAgICAgICBpZiAoIXRoaXMudXRpbHMuZ3JvdXBzLmJ5UGFyZW50R3JvdXBLZXlbZy5wYXJlbnRHcm91cEtleV0pe3RoaXMudXRpbHMuZ3JvdXBzLmJ5UGFyZW50R3JvdXBLZXlbZy5wYXJlbnRHcm91cEtleV0gPSBbXTsgfVxyXG4gICAgICAgIHRoaXMudXRpbHMuZ3JvdXBzLmJ5UGFyZW50R3JvdXBLZXlbZy5wYXJlbnRHcm91cEtleV0ucHVzaChnKTtcclxuICAgICAgICBpZiAodGhpcy51dGlscy5jb2xsYXBzZWRQYXJlbnRHcm91cC5oYXNPd25Qcm9wZXJ0eShnLnBhcmVudEdyb3VwS2V5KSAmJiAhdGhpcy5pc0dyb3VwQ29sbGFwc2VkKGcua2V5KSl7XHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZUdyb3VwKGcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZygnYnVpbGQgZ3JvdXBzJywgdGhpcy51dGlscy5ncm91cHMuYnlQYXJlbnRHcm91cEtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWlsZERhdGEoKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZXBhcmVudEdyb3VwKHBhcmVudEdyb3VwSWQpe1xyXG4gICAgaWYgKCF0aGlzLnV0aWxzLmNvbGxhcHNlZFBhcmVudEdyb3VwLmhhc093blByb3BlcnR5KHBhcmVudEdyb3VwSWQpKXtcclxuICAgICAgLy8gY29sbGFzc28gaWwgZ3J1cHBvXHJcbiAgICAgIHRoaXMudXRpbHMuY29sbGFwc2VkUGFyZW50R3JvdXBbcGFyZW50R3JvdXBJZF0gPSB0cnVlO1xyXG4gICAgICB0aGlzLnV0aWxzLmdyb3Vwcy5ieVBhcmVudEdyb3VwS2V5W3BhcmVudEdyb3VwSWRdLmZvckVhY2goZyA9PiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzR3JvdXBDb2xsYXBzZWQoZy5rZXkpKXtcclxuICAgICAgICAgIHRoaXMudG9nZ2xlR3JvdXAoZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1lbHNle1xyXG5cclxuICAgICAgZGVsZXRlIHRoaXMudXRpbHMuY29sbGFwc2VkUGFyZW50R3JvdXBbcGFyZW50R3JvdXBJZF07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b2dnbGVHcm91cChncm91cDogQ2lzR3JvdXApe1xyXG4gICAgY29uc3QgZ2sgPSB0aGlzLnV0aWxzLmNvbGxhcHNlZEdyb3VwLmZpbmRJbmRleChrID0+IGdyb3VwLmtleSA9PT0gayk7XHJcbiAgICBpZiAoZ2sgPT09IC0xKXtcclxuICAgICAgLy8gY29sbGFzc28gaWwgZ3J1cHBvXHJcbiAgICAgIHRoaXMudXRpbHMuY29sbGFwc2VkR3JvdXAucHVzaChncm91cC5rZXkpO1xyXG4gICAgICB0aGlzLnV0aWxzLml0ZW1zVG9GZXRjaEFmdGVyQ29sbGFwc2UgPSB7XHJcbiAgICAgICAgc2l6ZTogZ3JvdXAubGVuZ3RoLFxyXG4gICAgICAgIGdyb3VwOiBncm91cC5rZXlcclxuICAgICAgfTtcclxuICAgICAgdGhpcy5mZXRjaEl0ZW1zQWZ0ZXJDb2xsYXBzZSgpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIC8vIHJpbXVvdm8gY29sbGFzc29cclxuICAgICAgdGhpcy51dGlscy5jb2xsYXBzZWRHcm91cC5zcGxpY2UoZ2ssIDEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5idWlsZERhdGEoKTtcclxuICB9XHJcblxyXG4gIGZldGNoSXRlbXNBZnRlckNvbGxhcHNlKCl7XHJcbiAgICBpZiAodGhpcy51dGlscy5pdGVtc1RvRmV0Y2hBZnRlckNvbGxhcHNlICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICBsZXQgYWxsTG9hZGVkID0gdHJ1ZTtcclxuICAgICAgY29uc3QgZ3JvdXA6IENpc0dyb3VwID0gdGhpcy51dGlscy5ncm91cHMuYnlLZXlbdGhpcy51dGlscy5pdGVtc1RvRmV0Y2hBZnRlckNvbGxhcHNlLmdyb3VwXTtcclxuXHJcbiAgICAgIC8vIGZvcihsZXQgaT1ncm91cC5sYXN0SXRlbSsxO2k8TWF0aC5taW4odGhpcy5fY2FjaGVkRGF0YS5sZW5ndGgsKGdyb3VwLmxhc3RJdGVtK3RoaXMudXRpbHMuaXRlbXNUb0ZldGNoQWZ0ZXJDb2xsYXBzZS5zaXplKzEpKTtpKyspe1xyXG4gICAgICBmb3IgKCAgbGV0IGkgPSBncm91cC5sYXN0SXRlbSArIDE7XHJcbiAgICAgICAgICAgIGkgPCBNYXRoLm1pbih0aGlzLnNpaUxpc3RDb250cm9sbGVyLmFwaS5pdGVtc0NvdW50LCAoZ3JvdXAubGFzdEl0ZW0gKyB0aGlzLnV0aWxzLml0ZW1zVG9GZXRjaEFmdGVyQ29sbGFwc2Uuc2l6ZSArIDEpKTtcclxuICAgICAgICAgICAgaSsrKXtcclxuICAgICAgICBpZiAodGhpcy5fY2FjaGVkRGF0YVtpXSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgIGFsbExvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChhbGxMb2FkZWQpe1xyXG4gICAgICAgIHRoaXMudXRpbHMuaXRlbXNUb0ZldGNoQWZ0ZXJDb2xsYXBzZSA9IHVuZGVmaW5lZDtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgICB0aGlzLmZldGNoTmV4dFBhZ2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVmcmVzaFN1YnNjcmlwdGlvbkZ1bmN0aW9uKCl7XHJcblxyXG4gICAgLy8gY29uc3QgcGFnZXM9Wy4uLnRoaXMuX2ZldGNoZWRQYWdlc107XHJcbiAgICAvLyB0aGlzLl9mZXRjaGVkUGFnZXMuY2xlYXIoKTtcclxuICAgIGNvbnN0IHBhZ2VzID0gW107XHJcbiAgICB0aGlzLl9jYWNoZWREYXRhLmxlbmd0aCA9IDA7XHJcbiAgICBjb25zdCBsZnAgPSB0aGlzLmxhc3RGZXRjaGVkcGFnZTtcclxuICAgIHRoaXMubGFzdEZldGNoZWRwYWdlID0gLTE7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBsZnA7IGkrKyl7XHJcbiAgICAgIHBhZ2VzLnB1c2goaSk7XHJcbiAgICAgIHRoaXMuX2ZldGNoUGFnZShpKTtcclxuICAgIH1cclxuICAgIC8vIHBhZ2VzLmZvckVhY2goKHBhZ2UpPT57XHJcbiAgICAvLyAgIC8vIGNvbnNvbGUubG9nKGByZWZyZXNoIHBhZ2UgJHtwYWdlfWApXHJcbiAgICAvLyAgIHRoaXMuX2ZldGNoUGFnZShwYWdlKVxyXG4gICAgLy8gfSlcclxuXHJcbiAgICAvLyBkb3BvIGNoZSBobyBjYXJpY2F0byB0dXR0ZSBsZSBwYWdpbmUsIGRlc2VsZXppb25vIGdsaSBlbGVtZW50aSBjaGUgbm9uIHNvbm8gcGnDuSBwcmVzZW50aVxyXG4gICAgLy8gbWkgbWV0dG8gcXVpbmRpIGluIGFzY29sdG8gcGVyIGludGVyY2V0dGFyZSBsZSByZXNwb25zZSBkaSB0dXR0ZSBsZSBwYWdpbmUsIGUgYWxsYSBmaW5lIGZhY2NpbyBsJ29wZXJhemlvbmVcclxuICAgIGNvbnN0IGZldGNoU3Vic2MgPSB0aGlzLnNpaUxpc3RDb250cm9sbGVyLmZldGNoUGFnZURhdGEuc3Vic2NyaWJlKChyZXNwKSA9PiB7XHJcbiAgICAgIHBhZ2VzLnNwbGljZShwYWdlcy5pbmRleE9mKHJlc3AucGFnZSksIDEpO1xyXG4gICAgICBpZiAocGFnZXMubGVuZ3RoID09PSAwKXtcclxuICAgICAgICBmZXRjaFN1YnNjLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnNpaUxpc3RDb250cm9sbGVyLnJlbW92ZU1pc3NpbmdTZWxlY3Rpb24odGhpcy5fY2FjaGVkRGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBzZWxlY3RBbGxTdWJzY3JpcHRpb25GdW5jdGlvbigpe1xyXG4gICAgY29uc3QgbG9hZGVkSXRlbSA9IHRoaXMuX2NhY2hlZERhdGEucmVkdWNlKChhY2MsIGkpID0+IHtcclxuICAgICAgYWNjICs9IGkgPT09IHVuZGVmaW5lZCA/IDAgOiAxO1xyXG4gICAgICByZXR1cm4gYWNjOyB9LCAwKTtcclxuICAgICAgLy8gc2UgaG8gdHV0dGkgZ2xpIGVsZW1lbnRpXHJcbiAgICBpZiAobG9hZGVkSXRlbSA9PT0gdGhpcy5zaWlMaXN0Q29udHJvbGxlci5sYXN0RmV0Y2hSZXF1ZXN0SW5mby5jb3VudCl7XHJcbiAgICAgICAgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5tYXJrQXNTZWxlY3RlZCh0aGlzLl9jYWNoZWREYXRhKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5zZWxlY3RBbGxJblByb2dyZXNzID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBuZXdEYXRhID0gQXJyYXkuZnJvbTxvYmplY3Q+KHtsZW5ndGg6IHRoaXMuc2lpTGlzdENvbnRyb2xsZXIuYXBpLml0ZW1zQ291bnR9KTtcclxuICAgICAgICB0aGlzLl9jYWNoZWREYXRhLmZvckVhY2goKGNkLCBpbmRleCkgPT4gbmV3RGF0YVtpbmRleF0gPSBjZCk7XHJcbiAgICAgICAgdGhpcy5fY2FjaGVkRGF0YSA9IG5ld0RhdGE7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNpaUxpc3RDb250cm9sbGVyLmxhc3RGZXRjaFJlcXVlc3RJbmZvLm1heFBhZ2U7IGkrKyl7XHJcbiAgICAgICAgICBpZiAoaSA+IHRoaXMubGFzdEZldGNoZWRwYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZldGNoUGFnZShpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudXRpbHMuc2VsZWN0QWxsRmV0Y2hlZFBhZ2UgPT09IHVuZGVmaW5lZCl7dGhpcy51dGlscy5zZWxlY3RBbGxGZXRjaGVkUGFnZSA9IFtdOyB9XHJcbiAgICAgICAgICAgIHRoaXMudXRpbHMuc2VsZWN0QWxsRmV0Y2hlZFBhZ2UucHVzaChpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjaGVja0ZvclNlbGVjdEFsbChwYWdlKXtcclxuICAgIC8vIGNvbnNvbGUubG9nKGBjaGVja0ZvclNlbGVjdEFsbCAtPiAke3BhZ2V9YCAsdGhpcy5zZWxlY3RBbGxGZXRjaGVkUGFnZSlcclxuICAgIGlmICh0aGlzLnV0aWxzLnNlbGVjdEFsbEZldGNoZWRQYWdlICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICB0aGlzLnV0aWxzLnNlbGVjdEFsbEZldGNoZWRQYWdlLnNwbGljZSh0aGlzLnV0aWxzLnNlbGVjdEFsbEZldGNoZWRQYWdlLmluZGV4T2YocGFnZSksIDEpO1xyXG4gICAgICBpZiAodGhpcy51dGlscy5zZWxlY3RBbGxGZXRjaGVkUGFnZS5sZW5ndGggPT09IDApe1xyXG4gICAgICAgIHRoaXMudXRpbHMuc2VsZWN0QWxsRmV0Y2hlZFBhZ2UgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5zaWlMaXN0Q29udHJvbGxlci5tYXJrQXNTZWxlY3RlZCh0aGlzLl9jYWNoZWREYXRhKTtcclxuICAgICAgICB0aGlzLnNpaUxpc3RDb250cm9sbGVyLnNlbGVjdEFsbEluUHJvZ3Jlc3MgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19