import { User } from "./user";

export interface Item {
    id: number;
    name: string;
    pic: string;
    description: string;
    condition: string;
    categories: string;
    geoCode: string;
    googleId: string;
    google: User;
}
