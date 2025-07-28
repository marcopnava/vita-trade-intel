import * as cron from 'node-cron';
import { marketDataFetcher } from '../data/dataFetcher';
import { FETCH_INTERVALS } from '../config/instruments';

export class TaskScheduler {
  private static instance: TaskScheduler;
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private logger: Console;

  constructor() {
    this.logger = console;
  }

  public static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      TaskScheduler.instance = new TaskScheduler();
    }
    return TaskScheduler.instance;
  }

  /**
   * Start all scheduled tasks
   */
  public startScheduler(): void {
    this.logger.log('🚀 Starting market data scheduler...');

    // Price data - every 15 minutes
    const priceTask = cron.schedule('*/15 * * * *', async () => {
      this.logger.log('⏰ Scheduled price data fetch triggered');
      try {
        await marketDataFetcher.fetchPrices();
      } catch (error) {
        this.logger.error('❌ Scheduled price fetch failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    // Economic calendar - every hour
    const calendarTask = cron.schedule('0 * * * *', async () => {
      this.logger.log('⏰ Scheduled economic calendar fetch triggered');
      try {
        await marketDataFetcher.fetchEconomicCalendar();
      } catch (error) {
        this.logger.error('❌ Scheduled calendar fetch failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    // COT data - every Friday at 4 PM EST (9 PM UTC)
    const cotTask = cron.schedule('0 21 * * 5', async () => {
      this.logger.log('⏰ Scheduled COT data fetch triggered');
      try {
        await marketDataFetcher.fetchCOTData();
      } catch (error) {
        this.logger.error('❌ Scheduled COT fetch failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    // News - every 10 minutes
    const newsTask = cron.schedule('*/10 * * * *', async () => {
      this.logger.log('⏰ Scheduled news fetch triggered');
      try {
        await marketDataFetcher.fetchNews();
      } catch (error) {
        this.logger.error('❌ Scheduled news fetch failed:', error);
      }
    }, {
      scheduled: false,
      timezone: 'UTC'
    });

    // Store tasks for management
    this.tasks.set('prices', priceTask);
    this.tasks.set('calendar', calendarTask);
    this.tasks.set('cot', cotTask);
    this.tasks.set('news', newsTask);

    // Start all tasks
    priceTask.start();
    calendarTask.start();
    cotTask.start();
    newsTask.start();

    this.logger.log('✅ All scheduled tasks started');
  }

  /**
   * Stop all scheduled tasks
   */
  public stopScheduler(): void {
    this.logger.log('🛑 Stopping market data scheduler...');
    
    this.tasks.forEach((task, name) => {
      task.stop();
      this.logger.log(`⏹️ Stopped ${name} task`);
    });
    
    this.tasks.clear();
    this.logger.log('✅ All scheduled tasks stopped');
  }

  /**
   * Get scheduler status
   */
  public getStatus(): any {
    const status: any = {
      running: this.tasks.size > 0,
      tasks: {}
    };

    this.tasks.forEach((task, name) => {
      status.tasks[name] = {
        running: task.running || false,
        nextRun: task.nextDates?.(1)?.[0]?.toISOString() || null
      };
    });

    return status;
  }

  /**
   * Manual trigger for specific data type
   */
  public async triggerFetch(dataType: string): Promise<void> {
    this.logger.log(`🔄 Manual trigger: ${dataType}`);
    
    switch (dataType) {
      case 'prices':
        await marketDataFetcher.fetchPrices();
        break;
      case 'calendar':
        await marketDataFetcher.fetchEconomicCalendar();
        break;
      case 'cot':
        await marketDataFetcher.fetchCOTData();
        break;
      case 'news':
        await marketDataFetcher.fetchNews();
        break;
      case 'all':
        await Promise.all([
          marketDataFetcher.fetchPrices(),
          marketDataFetcher.fetchEconomicCalendar(),
          marketDataFetcher.fetchNews()
        ]);
        // COT data is heavy, so fetch separately if needed
        break;
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }
}

export const taskScheduler = TaskScheduler.getInstance();