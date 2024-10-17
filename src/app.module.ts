import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PdfModule } from './pdf/pdf.module';
import { EmailModule } from './email/email.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ClientsModule,
    InvoicesModule,
    PdfModule,
    EmailModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}