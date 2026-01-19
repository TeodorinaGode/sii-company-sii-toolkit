export interface ToolbarMenuDto {
    menu: ToolbarMenuCategory[];
}
export interface ToolbarMenuCategory {
    label: string;
    location: string;
    url: string;
    submenu: ToolbarSubmenu;
}
export interface ToolbarSubmenu {
    columns: ToolbarSubmenuColumn[];
}
export interface ToolbarSubmenuColumn {
    items: ToolbarSubmenuItem[];
}
export interface ToolbarSubmenuItem {
    label: string;
    location: string;
    openIn?: ToolbarSubmenuItemOpenIn;
    url: string;
    profiling: string;
    visibleProfiling: boolean;
}
export declare enum ToolbarSubmenuItemOpenIn {
    self = "self",
    tab = "tab",
    popup = "popup"
}
