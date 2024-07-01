import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ExchangeRateInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { fromCurrency, toCurrency, amount } = request.query;

        if (fromCurrency === toCurrency) {
            return of({ amount: Number(amount) });
        }
        return next.handle().pipe(map((data) => data));
    }
}
