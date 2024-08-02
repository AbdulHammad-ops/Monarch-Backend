import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExternalApiService } from './external-api.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller('external-api')
export class ExternalApiController {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly userService: UsersService,
  ) {}

  @Post('master')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  async master(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const res = await this.externalApiService.master(file.path, file);
    return res;
  }

  // @UseGuards(JwtAuthGuard)
  @Post('vocal-remover-2')
  @UseInterceptors(FileInterceptor('file'))
  spleeter2stem(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Observable<any> {
    //@ts-ignore
    // this.userService.getUserById(req.user.payload.sub);
    return this.externalApiService.spleeter2stem(file);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('vocal-remover-2')
  getSpleeter2Stem(@Query('uuid') uuid: string) {
    return this.externalApiService.getSpleeter2StemData(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('vocal-remover-4')
  @UseInterceptors(FileInterceptor('file'))
  spleeter4stem(@UploadedFile() file: Express.Multer.File): Observable<any> {
    return this.externalApiService.spleeter4stem(file);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('vocal-remover-4')
  getSpleeter4Stem(@Query('uuid') uuid: string) {
    return this.externalApiService.getSpleeter2StemData(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('vocal-remover-5')
  @UseInterceptors(FileInterceptor('file'))
  spleeter5stem(@UploadedFile() file: Express.Multer.File): Observable<any> {
    return this.externalApiService.spleeter5stem(file);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('vocal-remover-5')
  getSpleeter5Stem(@Query('uuid') uuid: string) {
    return this.externalApiService.getSpleeter2StemData(uuid);
  }
}
