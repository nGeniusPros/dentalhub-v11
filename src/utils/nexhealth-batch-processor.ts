import { nexhealthLogger } from './nexhealth-logger';

/**
 * NexHealth Batch Processor
 * 
 * This utility helps process large datasets from NexHealth in batches
 * to avoid overwhelming the API or the database.
 */

export interface BatchProcessorOptions<T> {
  /**
   * The name of the batch process (for logging)
   */
  name: string;
  
  /**
   * The batch size
   * Default: 50
   */
  batchSize?: number;
  
  /**
   * The delay between batches in milliseconds
   * Default: 1000 (1 second)
   */
  batchDelayMs?: number;
  
  /**
   * The maximum number of concurrent batches
   * Default: 1 (process batches sequentially)
   */
  maxConcurrent?: number;
  
  /**
   * Whether to continue processing if a batch fails
   * Default: true
   */
  continueOnError?: boolean;
  
  /**
   * The maximum number of retries for a failed batch
   * Default: 3
   */
  maxRetries?: number;
  
  /**
   * The delay between retries in milliseconds
   * Default: 5000 (5 seconds)
   */
  retryDelayMs?: number;
  
  /**
   * A function to process a single item
   */
  processItem: (item: T, index: number, batchIndex: number) => Promise<void>;
  
  /**
   * A function to process a batch of items
   * If provided, this will be used instead of processItem
   */
  processBatch?: (items: T[], batchIndex: number) => Promise<void>;
  
  /**
   * A function to call when progress is made
   */
  onProgress?: (processed: number, total: number, batchIndex: number) => void;
  
  /**
   * A function to call when a batch is completed
   */
  onBatchComplete?: (batchIndex: number, batchSize: number, timeMs: number) => void;
  
  /**
   * A function to call when a batch fails
   */
  onBatchError?: (error: any, batchIndex: number, items: T[]) => void;
}

export interface BatchProcessResult {
  /**
   * Whether the batch process was successful
   */
  success: boolean;
  
  /**
   * The total number of items processed
   */
  processed: number;
  
  /**
   * The total number of items that failed to process
   */
  failed: number;
  
  /**
   * The total number of batches processed
   */
  batches: number;
  
  /**
   * The total time taken in milliseconds
   */
  timeMs: number;
  
  /**
   * Any errors that occurred during processing
   */
  errors: any[];
}

export class NexHealthBatchProcessor<T> {
  private options: Required<BatchProcessorOptions<T>>;
  
  constructor(options: BatchProcessorOptions<T>) {
    this.options = {
      batchSize: 50,
      batchDelayMs: 1000,
      maxConcurrent: 1,
      continueOnError: true,
      maxRetries: 3,
      retryDelayMs: 5000,
      ...options,
      processItem: options.processItem,
      processBatch: options.processBatch || this.defaultProcessBatch.bind(this),
      onProgress: options.onProgress || (() => {}),
      onBatchComplete: options.onBatchComplete || (() => {}),
      onBatchError: options.onBatchError || (() => {})
    };
  }
  
  /**
   * Process an array of items in batches
   */
  async process(items: T[]): Promise<BatchProcessResult> {
    const startTime = Date.now();
    const result: BatchProcessResult = {
      success: true,
      processed: 0,
      failed: 0,
      batches: 0,
      timeMs: 0,
      errors: []
    };
    
    // Split items into batches
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += this.options.batchSize) {
      batches.push(items.slice(i, i + this.options.batchSize));
    }
    
    nexhealthLogger.info(`Starting batch process: ${this.options.name}`, {
      totalItems: items.length,
      batchCount: batches.length,
      batchSize: this.options.batchSize
    });
    
    // Process batches
    if (this.options.maxConcurrent > 1) {
      // Process batches concurrently
      await this.processBatchesConcurrently(batches, result);
    } else {
      // Process batches sequentially
      await this.processBatchesSequentially(batches, result);
    }
    
    // Calculate total time
    result.timeMs = Date.now() - startTime;
    
    nexhealthLogger.info(`Completed batch process: ${this.options.name}`, {
      totalItems: items.length,
      processed: result.processed,
      failed: result.failed,
      batches: result.batches,
      timeMs: result.timeMs
    });
    
    return result;
  }
  
  /**
   * Process batches sequentially
   */
  private async processBatchesSequentially(batches: T[][], result: BatchProcessResult): Promise<void> {
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchStartTime = Date.now();
      
      try {
        // Process the batch with retries
        await this.processBatchWithRetry(batch, i);
        
        // Update result
        result.processed += batch.length;
        result.batches++;
        
        // Call progress callback
        this.options.onProgress(result.processed, batches.flat().length, i);
        
        // Call batch complete callback
        this.options.onBatchComplete(i, batch.length, Date.now() - batchStartTime);
        
        // Add delay between batches
        if (i < batches.length - 1) {
          await this.delay(this.options.batchDelayMs);
        }
      } catch (error) {
        // Update result
        result.failed += batch.length;
        result.errors.push(error);
        
        // Call batch error callback
        this.options.onBatchError(error, i, batch);
        
        // Stop processing if continueOnError is false
        if (!this.options.continueOnError) {
          result.success = false;
          break;
        }
      }
    }
  }
  
  /**
   * Process batches concurrently
   */
  private async processBatchesConcurrently(batches: T[][], result: BatchProcessResult): Promise<void> {
    // Process batches in chunks of maxConcurrent
    for (let i = 0; i < batches.length; i += this.options.maxConcurrent) {
      const batchChunk = batches.slice(i, i + this.options.maxConcurrent);
      const batchPromises = batchChunk.map((batch, index) => {
        const batchIndex = i + index;
        const batchStartTime = Date.now();
        
        return this.processBatchWithRetry(batch, batchIndex)
          .then(() => {
            // Update result
            result.processed += batch.length;
            result.batches++;
            
            // Call progress callback
            this.options.onProgress(result.processed, batches.flat().length, batchIndex);
            
            // Call batch complete callback
            this.options.onBatchComplete(batchIndex, batch.length, Date.now() - batchStartTime);
          })
          .catch(error => {
            // Update result
            result.failed += batch.length;
            result.errors.push(error);
            
            // Call batch error callback
            this.options.onBatchError(error, batchIndex, batch);
            
            // Rethrow if continueOnError is false
            if (!this.options.continueOnError) {
              throw error;
            }
          });
      });
      
      try {
        await Promise.all(batchPromises);
      } catch (error) {
        // If continueOnError is false, stop processing
        if (!this.options.continueOnError) {
          result.success = false;
          break;
        }
      }
      
      // Add delay between batch chunks
      if (i + this.options.maxConcurrent < batches.length) {
        await this.delay(this.options.batchDelayMs);
      }
    }
  }
  
  /**
   * Process a batch with retry logic
   */
  private async processBatchWithRetry(batch: T[], batchIndex: number): Promise<void> {
    let retries = 0;
    
    while (true) {
      try {
        await this.options.processBatch(batch, batchIndex);
        return;
      } catch (error) {
        retries++;
        
        if (retries >= this.options.maxRetries) {
          nexhealthLogger.error(`Batch ${batchIndex} failed after ${retries} retries`, error, {
            batchIndex,
            batchSize: batch.length
          });
          throw error;
        }
        
        nexhealthLogger.warn(`Batch ${batchIndex} failed, retrying (${retries}/${this.options.maxRetries})`, {
          batchIndex,
          batchSize: batch.length,
          error: error.message
        });
        
        // Wait before retrying
        await this.delay(this.options.retryDelayMs);
      }
    }
  }
  
  /**
   * Default implementation of processBatch that calls processItem for each item
   */
  private async defaultProcessBatch(items: T[], batchIndex: number): Promise<void> {
    // Process items sequentially within the batch
    for (let i = 0; i < items.length; i++) {
      await this.options.processItem(items[i], i, batchIndex);
    }
  }
  
  /**
   * Helper function to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default NexHealthBatchProcessor;
