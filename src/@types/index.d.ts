declare module "@heroicons/react/outline";
declare module "styled-components";

interface IProduct {
  id: string;
  name: string;
  upc: string;
  fullDescription?: string;
}

interface IProductCategory {
  id: string | number;
  name: string;
  properties: IProductCategoryProperty[];
}

interface IProductCategoryProperty {
  name: string;
  type: string;
  options?: string[];
}

interface IProductHomePageResponse {
  id: string;
  name: string;
  startPrice: number;
  imagePath: string;
  username: string;
}

declare interface String {
  truncate: (num: number) => string;
}

declare interface String {
  prettyMoney: () => string;
  prettyDate: () => string;
}

declare interface Array<T> {
  has: (item: T) => boolean;
}
