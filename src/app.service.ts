import { Injectable } from '@nestjs/common';
import { validateServive } from './validate/validate.service';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { currencyFormatterService } from './utils/formatter';
import { winstonLogger } from './utils/winston-logger';

@Injectable()
export class AppService {

  constructor(private readonly validateServive: validateServive, private readonly currencyFormatter: currencyFormatterService) {}
  
  async readData() {

    winstonLogger.info('##### INÍCIO PROCESSO #####');

    const readFilePromise = new Promise<void>((resolve, reject) => {
      const path = __dirname + '/data/data.csv';

      const promises: Promise<any>[] = [];
      
      fs.createReadStream(path)
      .pipe(csvParser())
      .on('data', async (data) => {
        // Verifica se o documento é um CPF ou CNPJ válido
        promises.push(this.validateServive.validateDoc(data.nrCpfCnpj));
        
        this.validateServive.validateTotalValue_Installments(data.vlTotal, data.qtPrestacoes, data.vlPresta, data.nrContrato);

        // Converte os valores para BRL currency
        const monetaryFields = [
          'vlTotal',
          'vlPresta',
          'vlMora',
          'vlMulta',
          'vlOutAcr',
          'vlIof',
          'vlDescon',
          'vlAtual',
        ];
        monetaryFields.forEach((field)=>{
          data[field] = this.currencyFormatter.format(data[field]);
        });
      })
      .on('end', async () => {
        // Aguarda a conclusão de todas as promises
        await Promise.all(promises);
        winstonLogger.info('##### FIM PROCESSO #####');
        resolve();
      });
    });

    await readFilePromise;
    return 'Processamento concluído!';

  }
}
