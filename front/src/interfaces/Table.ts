export interface TableColumn<T> {
    label: string;
    value: string;
    renderCell?: (item: T) => any;
}