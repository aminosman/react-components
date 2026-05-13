/// <reference types="react" />
export interface NavItem {
    label: string;
    id: string;
    tab?: JSX.Element;
    permission?: () => boolean | undefined;
    content: any;
}
export interface Props {
    defaultActiveKey: string;
    nav: NavItem[];
    defaultPinnedTabs?: string[];
    title?: string;
    loading?: boolean;
    navLinkContainerProps?: any;
    navContentContainerProps?: any;
    onTitleEdit?: () => void;
    pinnedTabsStorageKey?: string;
    onTabChange?: (id: string) => void;
    onPinToggle?: (id: string, pinned: boolean) => void;
}
export default function TabLayout({ defaultActiveKey, nav, defaultPinnedTabs, title, loading, navLinkContainerProps, navContentContainerProps, onTitleEdit, pinnedTabsStorageKey, onTabChange, onPinToggle, }: Props): JSX.Element;
