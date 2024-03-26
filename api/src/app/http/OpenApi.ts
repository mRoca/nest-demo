import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrapOpenApiEndpoint = async (
  app: INestApplication,
): Promise<void> => {
  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('_doc', app, document);
};

export default bootstrapOpenApiEndpoint;
