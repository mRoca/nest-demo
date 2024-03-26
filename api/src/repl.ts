import { repl } from '@nestjs/core';
import { AppModule } from '@/app/AppModule';

async function bootstrap() {
  const replServer = await repl(AppModule);

  replServer.setupHistory('.repl_history', (err) => {
    if (err) {
      console.error(err);
    }
  });
}

bootstrap();
