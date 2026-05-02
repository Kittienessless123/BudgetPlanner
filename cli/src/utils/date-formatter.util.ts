interface ParsedDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
class DateParser {
  static parse(dateStr: string): ParsedDate | null {
    const cleaned = dateStr.trim();

    // ISO формат
    if (cleaned.includes("T")) {
      const date = new Date(cleaned);
      if (!isNaN(date.getTime())) {
        return {
          year: date.getUTCFullYear(),
          month: date.getUTCMonth() + 1,
          day: date.getUTCDate(),
          hour: date.getUTCHours(),
          minute: date.getUTCMinutes(),
          second: date.getUTCSeconds(),
        };
      }
    }

    // Произвольные разделители
    const parts = cleaned.split(/[T\s-/:.]/);
    const numbers = parts.filter((p) => p.length > 0).map(Number);

    if (numbers.length >= 3) {
      let yearIdx = 0;
      let monthIdx = 1;
      let dayIdx = 2;

      // Если первый элемент > 31, это скорее всего год
      if (numbers[0] > 31) {
        yearIdx = 0;
        monthIdx = 1;
        dayIdx = 2;
      }
      // Если последний элемент > 31, это год
      else if (numbers[2] > 31 && numbers[2] < 3000) {
        yearIdx = 2;
        monthIdx = 1;
        dayIdx = 0;
      }
      // Если первый элемент <= 12, возможно это месяц
      else if (numbers[0] <= 12 && numbers[1] > 12) {
        monthIdx = 0;
        dayIdx = 1;
        yearIdx = 2;
      }

      return {
        year: numbers[yearIdx],
        month: numbers[monthIdx],
        day: numbers[dayIdx],
        hour: numbers[3] || 0,
        minute: numbers[4] || 0,
        second: numbers[5] || 0,
      };
    }

    return null;
  }

  static format(date: ParsedDate, separator: string = "-"): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.year}${separator}${pad(date.month)}${separator}${pad(date.day)} ${pad(date.hour)}:${pad(date.minute)}:${pad(date.second)}`;
  }

  static toDate(parsed: ParsedDate): Date {
    return new Date(
      parsed.year,
      parsed.month - 1,
      parsed.day,
      parsed.hour,
      parsed.minute,
      parsed.second,
    );
  }

  static getTime(date: ParsedDate): string {
    let newDate = new Date();
    return String(newDate.setHours(date.hour, date.minute, date.second, 0));
  }

  static getDiffTimeDate(
    oldDate: Date,
    newDate: Date,
    need: "time" | "date",
  ): string {
    const diffMs = Math.abs(newDate.getTime() - oldDate.getTime());

    if (need === "date") {
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return `${days} day${days !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      return `${hours}h ${minutes}m ${seconds}s`;
    }
  }
}

// Использование
//const parsed = DateParser.parse('2024-05-02 15:30:45');
//console.log(parsed);
// { year: 2024, month: 5, day: 2, hour: 15, minute: 30, second: 45 }

//console.log(DateParser.toDate(parsed!));
//console.log(DateParser.format(parsed!, '/'));
// 2024/05/02 15:30:45
