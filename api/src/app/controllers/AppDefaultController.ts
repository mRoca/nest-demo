import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('/')
@ApiTags('Default')
export class AppDefaultController {
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Get('')
  home(): object {
    return { message: 'Welcome to this server :-)' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Healthcheck endpoint' })
  @ApiOkResponse()
  @Get('health')
  health(): object {
    return { alive: true };
  }

  // Useless endpoint allowing to avoid 404 while waiting for a true http proxy
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExcludeEndpoint()
  @Get('favicon.ico')
  favicon(): void {
    return;
  }
}
