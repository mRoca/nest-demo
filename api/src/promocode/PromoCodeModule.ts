import { Module } from '@nestjs/common';
import PromoCodeDatabaseProvider from '@/promocode/infrastructure/secondary/database/PromoCodeDatabaseProvider';
import PromoCodeProviderPort from '@/promocode/domain/ports/PromoCodeProviderPort';
import { PromoCodeHttpController } from '@/promocode/infrastructure/primary/controllers/PromoCodeHttpController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCodeEntity } from '@/promocode/infrastructure/secondary/database/PromoCodeEntity';
import PromoCodeRepository from '@/promocode/domain/repositories/PromoCodeRepository';
import ValidationRequestDataBuilder from '@/promocode/domain/services/ValidationRequestDataBuilder';
import PromoCodeValidator from '@/promocode/domain/services/PromoCodeValidator';
import WeatherProviderPort from '@/promocode/domain/ports/WeatherProviderPort';
import { Config } from '@/Config';
import FakeWeatherProvider from '@/promocode/infrastructure/secondary/weather/FakeWeatherProvider';
import OpenWeatherMapProvider from '@/promocode/infrastructure/secondary/weather/OpenWeatherMapProvider';

export const promoCodeEntities = [PromoCodeEntity];

@Module({
  imports: [TypeOrmModule.forFeature(promoCodeEntities)],
  controllers: [PromoCodeHttpController],
  providers: [
    PromoCodeRepository,
    PromoCodeValidator,
    ValidationRequestDataBuilder,
    { provide: PromoCodeProviderPort, useClass: PromoCodeDatabaseProvider },
    {
      provide: WeatherProviderPort,
      useFactory: () => {
        return Config.OPEN_WEATHER_MAP_API_TOKEN
          ? new OpenWeatherMapProvider(Config.OPEN_WEATHER_MAP_API_TOKEN)
          : new FakeWeatherProvider();
      },
    },
  ],
})
export class PromoCodeModule {}
