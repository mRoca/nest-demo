import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import PromoCodeCreationBody from '@/promocode/infrastructure/primary/dto/PromoCodeCreationBody';
import PromoCodeRepository from '@/promocode/domain/repositories/PromoCodeRepository';
import PromoCodeCreationResponse from '@/promocode/infrastructure/primary/dto/PromoCodeCreationResponse';
import ValidationException from '@/shared/domain/assertions/ValidationException';
import { ApiCreatedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import PromoCodeAlreadyExistsException from '@/promocode/domain/exceptions/PromoCodeAlreadyExistsException';
import ValidationOkResponse from '@/promocode/infrastructure/primary/dto/ValidationOkResponse';
import ValidationFailedResponse from '@/promocode/infrastructure/primary/dto/ValidationFailedResponse';
import { Name } from '@/promocode/domain/models/Name';
import PromoCodeValidator from '@/promocode/domain/services/PromoCodeValidator';
import ValidationBody from '@/promocode/infrastructure/primary/dto/ValidationBody';
import RestrictionRuleDenormalizationException from '@/promocode/domain/exceptions/RestrictionRuleNormalizationException';

@Controller('promocodes')
@ApiTags('PromoCode')
export class PromoCodeHttpController {
  constructor(
    private repository: PromoCodeRepository,
    private validator: PromoCodeValidator,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    schema: { $ref: getSchemaPath(PromoCodeCreationResponse) },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided',
  })
  @ApiExtraModels(PromoCodeCreationResponse)
  @ApiOperation({ summary: 'Create a new PromoCode. The name must be unique.' })
  async create(
    @Body() body: PromoCodeCreationBody,
  ): Promise<PromoCodeCreationResponse> {
    try {
      const code = body.toDomain();
      const created = await this.repository.save(code);
      return PromoCodeCreationResponse.fromDomain(created);
    } catch (e: unknown) {
      if (e instanceof ValidationException) {
        throw new ValidationPipe().createExceptionFactory()(e.errors);
      }
      if (e instanceof PromoCodeAlreadyExistsException) {
        throw new HttpException(
          'Another code with the same name already exist.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (e instanceof RestrictionRuleDenormalizationException) {
        throw new HttpException(
          'Unable to parse the rules: ' + e.message,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw e;
    }
  }

  @Post('/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    status: HttpStatus.OK,
    schema: { $ref: getSchemaPath(ValidationOkResponse) },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The arguments does not comply with the PromoCode',
    schema: { $ref: getSchemaPath(ValidationFailedResponse) },
  })
  @ApiExtraModels(ValidationOkResponse, ValidationFailedResponse)
  @ApiOperation({
    summary: 'Validate arguments against an existing PromoCode.',
  })
  async validate(@Body() body: ValidationBody): Promise<ValidationOkResponse> {
    try {
      const code = await this.repository.findByName(
        new Name(body.promocode_name),
      );
      await this.validator.validate(code, body.toDomainValidationData());
      return ValidationOkResponse.fromPromoCode(code);
    } catch (e: unknown) {
      throw new HttpException(
        ValidationFailedResponse.fromValidationException(
          body.promocode_name,
          e as Error,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
