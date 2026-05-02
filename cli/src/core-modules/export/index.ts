// services/exporter.service.ts
import { createObjectCsvWriter } from "csv-writer";
import * as fs from "fs";
import * as ExcelJS from "exceljs";
import * as path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type ReportType = "csv" | "excel" | "txt";

export interface ExportOptions {
  filename?: string;
  headers?: Array<{ id: string; title: string }>;
  data: any[];
}

export class Exporter {
  private data: any[];
  private reportType: ReportType;
  private outputDir: string;
  private filename: string;
  private headers?: Array<{ id: string; title: string }>;

  constructor(options: ExportOptions, reportType: ReportType) {
    this.data = options.data;
    this.reportType = reportType;
    this.filename = options.filename || `report_${Date.now()}`;
    this.headers = options.headers;
    
    // Создаём директорию для отчётов
    this.outputDir = path.join(process.cwd(), "reports");
    this.init();
  }

  /**
   * Инициализация директории для отчётов
   */
  private init(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Генерация отчёта
   */
  async generate(): Promise<{ success: boolean; path: string; error?: string }> {
    try {
      switch (this.reportType) {
        case "csv":
          return await this.writeCsvReport();
        case "excel":
          return await this.writeExcelReport();
        case "txt":
          return await this.writeTxtReport();
        default:
          throw new Error(`Unsupported report type: ${this.reportType}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Error generating report:", errorMsg);
      return { success: false, path: "", error: errorMsg };
    }
  }

  /**
   * Создание CSV отчёта
   */
  private async writeCsvReport(): Promise<{ success: boolean; path: string; error?: string }> {
    try {
      const filePath = path.join(this.outputDir, `${this.filename}.csv`);
      
      // Если заголовки не переданы, генерируем из первого объекта
      const headers = this.headers || this.generateHeadersFromData();
      
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: headers
      });

      await csvWriter.writeRecords(this.data);
      console.log(`✅ CSV report created: ${filePath}`);
      
      return { success: true, path: filePath };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return { success: false, path: "", error: errorMsg };
    }
  }

  /**
   * Создание Excel отчёта
   */
  private async writeExcelReport(): Promise<{ success: boolean; path: string; error?: string }> {
    try {
      const filePath = path.join(this.outputDir, `${this.filename}.xlsx`);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Report");

      // Если есть данные, создаём колонки из ключей первого объекта
      if (this.data.length > 0) {
        const keys = Object.keys(this.data[0]);
        
        // Определяем колонки
        worksheet.columns = keys.map(key => ({
          header: this.headers?.find(h => h.id === key)?.title || key.toUpperCase(),
          key: key,
          width: 20
        }));

        // Добавляем данные
        this.data.forEach(row => {
          worksheet.addRow(row);
        });

        // Стилизация заголовков
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };
      }

      await workbook.xlsx.writeFile(filePath);
      console.log(`✅ Excel report created: ${filePath}`);
      
      return { success: true, path: filePath };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return { success: false, path: "", error: errorMsg };
    }
  }

  /**
   * Создание TXT отчёта
   */
  private async writeTxtReport(): Promise<{ success: boolean; path: string; error?: string }> {
    try {
      const filePath = path.join(this.outputDir, `${this.filename}.txt`);
      
      // Форматируем данные для TXT
      let content = "";
      
      if (this.data.length > 0) {
        // Заголовки
        const headers = Object.keys(this.data[0]);
        content += headers.join(" | ") + "\n";
        content += "=".repeat(content.length) + "\n";
        
        // Данные
        this.data.forEach(row => {
          const values = headers.map(h => row[h]);
          content += values.join(" | ") + "\n";
        });
        
        // Статистика
        content += "\n" + "=".repeat(50) + "\n";
        content += `Total records: ${this.data.length}\n`;
        content += `Generated: ${new Date().toISOString()}\n`;
      } else {
        content = "No data available for report\n";
      }

      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✅ TXT report created: ${filePath}`);
      
      return { success: true, path: filePath };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      return { success: false, path: "", error: errorMsg };
    }
  }

  /**
   * Генерация заголовков из данных
   */
  private generateHeadersFromData(): Array<{ id: string; title: string }> {
    if (this.data.length === 0) return [];
    
    const keys = Object.keys(this.data[0]);
    return keys.map(key => ({
      id: key,
      title: key.charAt(0).toUpperCase() + key.slice(1) // Capitalize first letter
    }));
  }

  /**
   * Статический метод для быстрого экспорта
   */
  static async quickExport(data: any[], type: ReportType, filename?: string): Promise<string> {
    const exporter = new Exporter({ data, filename }, type);
    const result = await exporter.generate();
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return result.path;
  }
}