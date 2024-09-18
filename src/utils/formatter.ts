import { Injectable } from "@nestjs/common";

@Injectable()
export class currencyFormatterService {
    format(amount: number): string{
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formatter.format(amount);
    }
}