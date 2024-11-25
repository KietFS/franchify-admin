declare module '@heroicons/react/outline';
declare module 'styled-components';

interface ProductPrice {
    price: number;
    displayPrice: string;
    salePrice?: number;
    displaySalePrice?: string;
}

interface IUser {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    address?: IAddress;

    [key: string]: any;
}

interface IAddress {
    addressId: number;
    homeNumber: string;
    city: {
        id: number;
        name: string;
    };
    district: {
        id: number;
        name: string;
    };
    ward: {
        id: number;
        name: string;
    };
}


enum OrderStatus {
    PENDING = 'pending',
    RECEIVED = 'received',
    PROCESSING = 'processing',
    SHIPPING = 'shipping',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

interface IProduct {
    id: string;
    upc: string;
    name: string;
    price: ProductPrice;
    isOnSale?: boolean;
    fullDescription?: string;
    shortDescription?: string;
    nutritionInformations?: string;
    category?: number;
    images?: string[];
    thumbnail?: string;
    category?: IProductCategory;
    properties?: { [key: string]: string | number | boolean };
}

interface IStoreProduct {
    product?: IProduct;
    price?: ProductPrice;
    inventory: number;
}

interface IStore {
    id: number;
    name: string;
    storeCode: number;
    supportPickup: boolean;
    supportDelivery: boolean;
    openTime: number;
    closeTime: number;
    lat: string;
    lng: string;
}

interface IProductCategory {
    id: string | number;
    name: string;
    properties: IProductCategoryProperty[];
}

interface IProductCategoryProperty {
    displayName: string;
    name: string;
    type: string;
    options?: string[];
}


interface IOrder {
    id: number;
    user?: IUser;
    status?: OrderStatus;
    createdAt?: string;
    updatedAt?: string;
    orderAddress?: IOrderAddress;
    orderUserInfo?: IOrderUserInfo | null;
    store?: IStore;
    orderDetails?: OrderDetail[];
    isApplyUserSavePoints?: boolean;
    totalAmount?: number;
}

interface IOrderDetail {
    id: number;
    product: IProduct;
    quantity: number;
}

declare interface String {
    truncate: (num: number) => string;
}

declare interface String {
    prettyMoney: () => string;
    prettyDate: () => string;
    prettyDateTime: () => string;
}

declare interface Array<T> {
    has: (item: T) => boolean;
}
