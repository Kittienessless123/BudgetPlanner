// commands/report/export.command.ts
import { Command } from 'commander';
import { Exporter, ReportType } from '../../core-modules/export/index.ts';
import { authMiddleware } from '../../cli/middleware.ts';

export class ExportReportCommand {
  register(program: Command): void {
    program
      .command('report-export')
      .description('Export report to file')
      .option('-t, --type <type>', 'Export type: csv, excel, txt', 'csv')
      .option('-f, --filename <name>', 'Output filename')
      .option('-d, --data <data>', 'JSON data to export')
      .action(authMiddleware.protect(async (options: { filename: any; type: string; }) => {
        // Пример данных
        const reportData = [
          { id: 1, name: 'John Doe', email: 'john@example.com', amount: 5000 },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', amount: 7500 },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', amount: 3000 }
        ];
        
        const exporter = new Exporter(
          { 
            data: reportData,
            filename: options.filename,
            headers: [
              { id: 'id', title: 'ID' },
              { id: 'name', title: 'Full Name' },
              { id: 'email', title: 'Email Address' },
              { id: 'amount', title: 'Amount (RUB)' }
            ]
          },
          options.type as ReportType
        );
        
        const result = await exporter.generate();
        
        if (result.success) {
          console.log(`✅ Report saved to: ${result.path}`);
        } else {
          console.error(`❌ Failed: ${result.error}`);
        }
      }));
  }
}