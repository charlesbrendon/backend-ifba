import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PdfModule } from '../pdf/pdf.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PdfModule, EmailModule],
  providers: [InvoicesService, PrismaService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}