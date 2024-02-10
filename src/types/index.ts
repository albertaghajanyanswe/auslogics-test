import type { GetProp, TableProps } from "antd";

export type ColumnsType<T> = TableProps<T>['columns'];
export type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;


export interface DataType {
  key: number;
  stroka: string;
  data: string;
  number: number;
  flag: boolean;
  stroka2: string;
  data2: string;
  number2: number;
  flag2: boolean;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}