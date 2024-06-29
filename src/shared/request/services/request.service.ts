import { HttpService } from "@nestjs/axios";
import { RequestInterface } from "../interfaces/request.interface";
import { catchError, firstValueFrom } from "rxjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RequestService {
    constructor(private readonly httpService: HttpService) { }

    async create(requestInterface: RequestInterface): Promise<any> {
        const { data } = await firstValueFrom(
            this.httpService
                .request({
                    url: requestInterface.url,
                    headers: requestInterface.header,
                    data: requestInterface.data,
                    method: requestInterface.method,
                })
                .pipe(
                    catchError((error) => {
                        throw "An error happened!";
                    }),
                ),
        );
        return data;
    }
}
