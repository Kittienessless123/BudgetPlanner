const toasted = require('toasted-notifier');
import { EventEmitter } from 'events';

const notificationEmitter = new EventEmitter();

export class NotificationService {
  /**
   * Отправляет системное уведомление
   * @param title - Заголовок уведомления
   * @param message - Текст уведомления
   * @param sound - Воспроизвести звук (по умолчанию false)
   * @param wait - Ждать реакции пользователя (по умолчанию false)
   */
  static async send(
    title: string,
    message: string,
    sound: boolean = false,
    wait: boolean = false
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      toasted.notify(
        {
          title: title,
          message: message,
          sound: sound,      // Звук (работает на Windows и macOS)
          wait: wait,        // Будет ждать, пока пользователь нажмет
          // icon: '/path/to/icon.png', // Можно добавить иконку (абсолютный путь)
        },
        (err: any, response: any, metadata: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  /**
   * Уведомление о платеже (пример использования)
   */
  static async paymentReminder(billName: string, amount: number, dueDate: Date): Promise<void> {
    const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const urgency = daysLeft <= 1 ? '⚠️ СРОЧНО! ⚠️' : '📅 Напоминание';
    
    await this.send(
      `${urgency} ${billName}`,
      `Сумма: ${amount} руб.\nОсталось дней: ${daysLeft}`,
      daysLeft <= 1, // Включаем звук только для срочных
      false
    );
  }

  /**
   * Уведомление о долге
   */
  static async debtReminder(personName: string, amount: number, isBorrowed: boolean): Promise<void> {
    const action = isBorrowed ? 'должны вернуть' : 'пора вернуть';
    await this.send(
      `💸 Долг: ${personName}`,
      `${action} ${amount} руб.`,
      true,
      false
    );
  }

  /**
   * Уведомление о превышении бюджета
   */
  static async budgetExceeded(category: string, spent: number, limit: number): Promise<void> {
    await this.send(
      `⚠️ Превышен лимит: ${category}`,
      `Потрачено: ${spent} руб.\nЛимит: ${limit} руб.\nПревышение: ${spent - limit} руб.`,
      true,
      false
    );
  } 
}