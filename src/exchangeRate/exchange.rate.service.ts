import { Injectable } from "@nestjs/common";
import { RequestService } from "./../shared/request/services/request.service";

@Injectable()
export class ExchangeRateService {
    constructor(private requestService: RequestService) { }

}