import { Method } from "axios";

export interface RequestInterface {
    method: Method;
    url: string;
    data?: any;
    header?: any;
}
