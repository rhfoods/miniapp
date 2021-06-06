export interface IList<ListItme> {
  list?: ListItme[];
  more?: boolean;
  [propname: string]: any;
}

export interface ISavePoints<ListItme> extends IList<ListItme> {
  title?: string; // 当前分类名
  sortId?: number; // 当前分类id
}
