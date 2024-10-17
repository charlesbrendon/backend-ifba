import { Injectable } from '@nestjs/common';
import * as PdfMake from 'pdfmake/build/pdfmake';
import * as PdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

(PdfMake as any).vfs = PdfFonts.pdfMake.vfs;

@Injectable()
export class PdfService {
  async generateInvoicePdf(invoice: any): Promise<Buffer> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Invoice', style: 'header' },
        { text: `Invoice Number: ${invoice.number}`, style: 'subheader' },
        { text: `Date: ${invoice.issueDate}`, style: 'subheader' },
        { text: `Due Date: ${invoice.dueDate}`, style: 'subheader' },
        { text: 'Client Information', style: 'subheader' },
        { text: `${invoice.client.name}` },
        { text: `${invoice.client.email}` },
        { text: 'Items', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Description', 'Quantity', 'Unit Price', 'Total'],
              ...invoice.items.map(item => [
                item.description,
                item.quantity.toString(),
                item.unitPrice.toFixed(2),
                (item.quantity * item.unitPrice).toFixed(2),
              ]),
            ],
          },
        },
        { text: `Total: $${invoice.total.toFixed(2)}`, style: 'total' },
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        total: { fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
      },
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = PdfMake.createPdf(docDefinition);
      pdfDoc.getBuffer((buffer: Buffer) => {
        resolve(buffer);
      });
    });
  }
}