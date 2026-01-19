import { SorterGroupAction } from '../../lib/components/list-sorter/list-sorter-option/list-sorter-option.component';
export type SiiSortGroup = {
    groupKey: string;
    groupValue: string;
    parentGroupKey?: string;
    parentGroupValue?: string;
    groupLabelTransform?: (rid: any, value: any, obj: any) => string;
    parentGroupLabelTransform?: (rid: any, value: any, obj: any) => string;
    groupAction?: SorterGroupAction[];
    parentGroupAction?: SorterGroupAction[];
};
