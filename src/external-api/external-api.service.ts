import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import * as FormData from 'form-data';
import * as fs from 'fs';
import appConfig from 'src/config/app.config';
import { media } from '@dolbyio/dolbyio-rest-apis-client';
import { Logger } from '@dolbyio/dolbyio-rest-apis-client';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {
    Logger.useDefaults({
      defaultLevel: Logger.TRACE,
    });
  }

  async master(originalFilePath: string, file: Express.Multer.File) {
    const auth = appConfig().auth;
    let jwt = await media.authentication.getApiAccessToken(
      auth.dolby.apiKey,
      auth.dolby.appSecret,
    );

    console.log('Access token', jwt);
    const inputUrl = `dlb://in/hammad_mastering_master_class/custom/very/${file.filename}`;
    // const originalFilePath = '/path/to/original_file.mp4';

    await media.io.uploadFile(jwt, inputUrl, originalFilePath);

    const outputUrl = `dlb://out/hammad_mastering_master_class/custom/very/${file.filename}`;

    const jobDescription = JSON.stringify({
      inputs: [
        {
          source: inputUrl,
        },
      ],
      outputs: [
        {
          destination: outputUrl,
          master: {
            dynamic_eq: { enable: true, preset: 'a' },
            loudness: { enable: true },
            stereo_image: { enable: true },
          },
          kind: 'aac',
        },
      ],
    });

    // const jobId = await media.enhance.start(jwt, jobDescription);
    const jobId = await media.mastering.start(jwt, jobDescription);

    const sleep = (delay: number) => new Promise((r) => setTimeout(r, delay));
    // let result = await media.enhance.getResults(jwt, jobId);
    let result = await media.mastering.getResults(jwt, jobId);
    while (result.status === 'Pending' || result.status === 'Running') {
      console.log(result.progress);
      console.log(`Job status is ${result.status}, taking a 5 second break...`);
      await sleep(5000);

      result = await media.mastering.getResults(jwt, jobId);
    }

    if (result.status !== 'Success') {
      console.error('There was a problem with processing the file', result);
      return;
    }

    const enhancedFilePath = `./public/${file.filename}`;
    jwt = await media.authentication.getApiAccessToken(
      auth.dolby.apiKey,
      auth.dolby.appSecret,
    );
    await media.io.downloadFile(jwt, outputUrl, enhancedFilePath);
    return file.filename;
  }

  // vocalRemover(fileData: Express.Multer.File): Observable<AxiosResponse<any>> {
  //   const data = new FormData();
  //   data.append('fileName', fileData.originalname, fileData.originalname);

  //   const headers = {
  //     'x-rapidapi-key': 'b044ab2614msh855064233f103f8p1066b5jsn3b593da0e07a',
  //     'x-rapidapi-host': 'vocal-remover.p.rapidapi.com',
  //     ...data.getHeaders(),
  //   };

  //   const res = this.httpService
  //     .post('https://vocal-remover.p.rapidapi.com/api/v2/FileUpload', data, {
  //       headers,
  //     })
  //     .pipe(map((response: AxiosResponse) => response.data));

  //   console.log(res);
  //   return res;
  // }

  // processFile(fileName: string): Observable<AxiosResponse<any>> {
  //   const data = new FormData();
  //   data.append('file_name', fileName);

  //   const headers = {
  //     'x-rapidapi-key': 'b044ab2614msh855064233f103f8p1066b5jsn3b593da0e07a',
  //     'x-rapidapi-host': 'vocal-remover.p.rapidapi.com',
  //     ...data.getHeaders(),
  //   };

  //   const res = this.httpService
  //     .post('https://vocal-remover.p.rapidapi.com/api/v2/ProcessFile', data, {
  //       headers,
  //     })
  //     .pipe(map((response: AxiosResponse) => response.data));

  //   console.log(res);

  //   return res;
  // }

  spleeter2stem(file: Express.Multer.File): Observable<any> {
    const form = new FormData();
    const auth = appConfig().auth;
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('task', 'spleeter:2stems');
    form.append('sample', '1');
    console.log(auth);
    const headers = {
      ...form.getHeaders(),
      accept: 'application/json',
      Authorization: `Bearer ${auth.vocalRemover.vocalApiToken}`,
    };

    return this.httpService
      .post('https://vocalremover.com/api/file-conversion/create', form, {
        headers,
      })
      .pipe(map((response: AxiosResponse) => response.data));
  }

  spleeter4stem(file: Express.Multer.File): Observable<any> {
    const form = new FormData();
    const auth = appConfig().auth;
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('task', 'spleeter:4stems');
    form.append('sample', '1');
    console.log(auth);
    const headers = {
      ...form.getHeaders(),
      accept: 'application/json',
      Authorization: `Bearer ${auth.vocalRemover.vocalApiToken}`,
    };

    return this.httpService
      .post('https://vocalremover.com/api/file-conversion/create', form, {
        headers,
      })
      .pipe(map((response: AxiosResponse) => response.data));
  }

  spleeter5stem(file: Express.Multer.File): Observable<any> {
    const form = new FormData();
    const auth = appConfig().auth;
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('task', 'spleeter:5stems');
    form.append('sample', '1');
    console.log(auth);
    const headers = {
      ...form.getHeaders(),
      accept: 'application/json',
      Authorization: `Bearer ${auth.vocalRemover.vocalApiToken}`,
    };

    return this.httpService
      .post('https://vocalremover.com/api/file-conversion/create', form, {
        headers,
      })
      .pipe(map((response: AxiosResponse) => response.data));
  }

  getSpleeter2StemData(fileConversionId: string): Observable<any> {
    const url = `https://vocalremover.com/api/file-conversion/${fileConversionId}`;
    const headers = {
      accept: 'application/json',
      Authorization: 'Bearer tvAmRy3BcXILlVjaP2l3ahMbGVkdltuYja372VYT12adb6a8',
    };

    return this.httpService
      .get(url, { headers })
      .pipe(map((response: AxiosResponse) => response.data));
  }
}
