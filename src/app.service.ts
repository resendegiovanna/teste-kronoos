import { Injectable } from '@nestjs/common';
import { validateServive } from './validate/validate.service';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { currencyFormatterService } from './utils/formatter';
import { winstonLogger } from './utils/winston-logger';
import { Readable } from 'stream';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class AppService {

  constructor(private readonly validateServive: validateServive, private readonly currencyFormatter: currencyFormatterService) {}
  
  async readData() {

    winstonLogger.info('##### INÍCIO PROCESSO #####');

    let result = [];

    const readFilePromise = new Promise<void>((resolve, reject) => {
      const path = __dirname + '/data/data.csv';

      const promises: Promise<any>[] = [];
      
      fs.createReadStream(path)
      .pipe(csvParser())
      .on('data', async (data) => {
        // Verifica se o documento é um CPF ou CNPJ válido
        promises.push(this.validateServive.validateDoc(data.nrCpfCnpj).then((valid)=>{
          data['validDoc'] = valid;
        }));
        
        const validTotalValue_Installments = this.validateServive.validateTotalValue_Installments(data.vlTotal, data.qtPrestacoes, data.vlPresta, data.nrContrato);
        data['validTotalValue_Installments'] = validTotalValue_Installments;

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
        result.push(data);
      })
      .on('end', async () => {
        // Aguarda a conclusão de todas as promises
        await Promise.all(promises);
        winstonLogger.info('##### FIM PROCESSO #####');
        resolve();
      });
    });

    await readFilePromise;
    return result;
  }

  async createCSV(data: any[]): Promise<Readable>{
    const header = Object.keys(data[0]);

    const csvWriter = createObjectCsvStringifier({
      header: header.map((header) => ({ id: header, title: header })),
    });

    const csvContent = csvWriter.getHeaderString() + csvWriter.stringifyRecords(data);

    const stream = new Readable();
    stream.push(csvContent);
    stream.push(null); 

    return stream;
  }

}
