import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get('db')
  async checkDatabaseHealth() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    const connectionStatus = {
      state: states[this.connection.readyState],
      stateNumber: this.connection.readyState,
      host: this.connection.host,
      name: this.connection.name,
      port: this.connection.port,
      isConnected: this.connection.readyState === 1,
      timestamp: new Date().toISOString()
    };

    // Test database operation
    try {
      if (this.connection.db) {
        const admin = this.connection.db.admin();
        const pingResult = await admin.ping();
        
        const collections = await this.connection.db.listCollections().toArray();
        const stats = await this.connection.db.stats();

        return {
          status: 'healthy',
          connection: connectionStatus,
          ping: pingResult,
          collections: collections.map(c => c.name),
          stats: {
            collections: stats.collections,
            objects: stats.objects,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize
          }
        };
      } else {
        return {
          status: 'unhealthy',
          connection: connectionStatus,
          error: 'Database not available'
        };
      }
    } catch (error: any) {
      return {
        status: 'unhealthy',
        connection: connectionStatus,
        error: error.message
      };
    }
  }

  @Get()
  async checkOverallHealth() {
    const dbHealth = await this.checkDatabaseHealth();
    
    return {
      timestamp: new Date().toISOString(),
      status: dbHealth.status === 'healthy' ? 'healthy' : 'degraded',
      services: {
        database: dbHealth.status,
        api: 'healthy'
      },
      details: {
        database: dbHealth
      }
    };
  }
}
