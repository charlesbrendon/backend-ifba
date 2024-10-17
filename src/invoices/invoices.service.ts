import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
    private emailService: EmailService
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { clientId, items, ...rest } = createInvoiceDto;
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    
    return this.prisma.invoice.create({
      data: {
        ...rest,
        clientId,
        totalAmount,
        items: {
          create: items
        },
        number: `INV-${Date.now()}`, // Simple invoice number generation
        status: 'PENDING'
      },
      include: {
        client: true,
        items: true
      }
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: {
        client: true,
        items: true
      }
    });
  }

  async findOne(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        items: true
      }
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const { items, ...rest } = updateInvoiceDto;
    
    if (items) {
      await this.prisma.item.deleteMany({ where: { invoiceId: id } });
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...rest,
        items: items ? {
          create: items
        } : undefined,
        totalAmount: items
          ? items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
          : undefined
      },
      include: {
        client: true,
        items: true
      }
    });
  }

  async remove(id: number) {
    return this.prisma.invoice.delete({ where: { id } });
  }

  async markAsPaid(id: number) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status: 'PAID' }
    });
  }

  async generatePdf(id: number): Promise<Buffer> {
    const invoice = await this.findOne(id);
    return this.pdfService.generateInvoicePdf(invoice);
  }

  async sendInvoiceByEmail(id: number) {
    const invoice = await this.findOne(id);
    const pdfBuffer = await this.generatePdf(id);
    
    await this.emailService.sendEmail({
      to: invoice.client.email,
      subject: `Invoice ${invoice.number}`,
      text: `Please find attached the invoice ${invoice.number}.`,
      attachments: [
        {
          filename: `invoice-${invoice.number}.pdf`,
          content: pdfBuffer
        }
      ]
    });

    return { message: 'Invoice sent successfully' };
  }
}