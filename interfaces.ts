export interface MenuItem {
    name: string,
    command?: string | null,
    action?: any | null,
    url?: string | null,
    disabled?: boolean | null,
    is_separator?: boolean | null
    sub_items?: MenuItem[] | null
}
