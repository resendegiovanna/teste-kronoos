import { Injectable } from '@nestjs/common';
import { winstonLogger } from 'src/utils/winston-logger';

@Injectable()
export class validateServive{

    validCPF(cpf: string): boolean {
        if (cpf.length != 11) return false;

        const firstNine = cpf.substring(0, 9).split('');
        const lastTwo = cpf.substring(9, 11).split('');
        let sumFirstNine = 0;
        let sumFirstTen = 0;
        let firstCheckDigit;
        let lastCheckDigit;

        // Verificando primeiro dígito
        for (let i = 0, m = 10; i <= 8; i++, m--) {
            sumFirstNine += parseInt(firstNine[i]) * m;
        }
        let modFirstCheckDigit = 11 - (sumFirstNine % 11);
        firstCheckDigit = modFirstCheckDigit >= 10 ? 0 : modFirstCheckDigit;

        // Verificando segundo dígito
        const firstTen = firstNine;
        firstTen.push(firstCheckDigit);
        for (let i = 0, m = 11; i <= 9; i++, m--) {
            sumFirstTen += parseInt(firstNine[i]) * m;
        }
        let modLastCheckDigit = 11 - (sumFirstTen % 11);
        lastCheckDigit = modLastCheckDigit >= 10 ? 0 : modLastCheckDigit;
        
        return (firstCheckDigit == parseInt(lastTwo[0])) && lastCheckDigit == parseInt(lastTwo[1]);
    }

    validCNPJ(cnpj: string): boolean {
        if (cnpj.length != 14) return false;

        const firstTwelveReverse = cnpj.substring(0, 12).split('').reverse();
        const lastTwo = cnpj.substring(12, 14).split('');
        let sumFirstTwelve = 0;
        let sumFirstThirteen = 0;
        let firstCheckDigit;
        let lastCheckDigit;

        // Verificando primeiro dígito
        for (let i = 0, m = 2; i <= 11; i++, m++) {
            if(m > 9) m = 2;
            sumFirstTwelve += parseInt(firstTwelveReverse[i]) * m;
        }
        let modFirstCheckDigit = 11 - (sumFirstTwelve % 11);
        firstCheckDigit = modFirstCheckDigit >= 10 ? 0 : modFirstCheckDigit;

        // Verificando segundo dígito
        const firstThirteenReverse = firstTwelveReverse;
        firstThirteenReverse.unshift(firstCheckDigit);
        for (let i = 0, m = 2; i <= 12; i++, m++) {
            if(m > 9) m = 2;
            sumFirstThirteen += parseInt(firstThirteenReverse[i]) * m;
        }
        let modLastCheckDigit = 11 - (sumFirstThirteen % 11);
        lastCheckDigit = modLastCheckDigit >= 10 ? 0 : modLastCheckDigit;

        return (firstCheckDigit == parseInt(lastTwo[0])) && lastCheckDigit == parseInt(lastTwo[1]);
    }

    async validateDoc(doc: string): Promise<boolean> {
        const validDoc = (this.validCPF(doc) || this.validCNPJ(doc));
        if(!validDoc) winstonLogger.info('Documento inválido - ' + doc);
        return validDoc;
    }

    validateTotalValue_Installments(totalValue, amountInstallments, installmentsValue, contractNumber){
        const valid = (totalValue / amountInstallments) == installmentsValue;
        if(!valid) winstonLogger.info('Erro em valor total e prestações - contrato: ' + contractNumber);
        return valid;
    }

}