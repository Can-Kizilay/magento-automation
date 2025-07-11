import { Filter } from "./filter";

export interface Product {
    mainCategory: string;
    category: string;
    filters: Filter[];
    isRandomlySelected: boolean;
    quantity: string;
    discountCode: string;
    shippingDestination: string;
    shippingMethod: string;
    discountRate: number;
}