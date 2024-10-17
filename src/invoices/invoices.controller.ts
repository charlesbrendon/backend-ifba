import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'The invoice has been successfully created.' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, description: 'Return all invoices.' })
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice by id' })
  @ApiResponse({ status: 200, description: 'Return the invoice.' })
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiResponse({ status: 200, description: 'The invoice has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiResponse({ status: 200, description: 'The invoice has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }

  @Put(':id/pay')
  @ApiOperation({ summary: 'Mark an invoice as paid' })
  @ApiResponse({ status: 200, description: 'The invoice has been successfully marked as paid.' })
  markAsPaid(@Param('id') id: string) {
    return this.invoicesService.markAsPaid(+id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Generate PDF for an invoice' })
  @ApiResponse({ status: 200, description: 'Return the PDF of the invoice.' })
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.invoicesService.generatePdf(+id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send an invoice by email' })
  @ApiResponse({ status: 200, description: 'The invoice has been successfully sent.' })
  sendInvoiceByEmail(@Param('id') id: string) {
    return this.invoicesService.sendInvoiceByEmail(+id);
  }
}