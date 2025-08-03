import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongooseConnectionTest implements OnModuleInit {
  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    this.testConnection();
  }

  private testConnection() {
    console.log('🔍 Testing Mongoose Connection...');
    
    // Check connection state
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    console.log(`📊 Connection State: ${states[this.connection.readyState]} (${this.connection.readyState})`);
    console.log(`🏠 Database Host: ${this.connection.host}`);
    console.log(`📦 Database Name: ${this.connection.name}`);
    console.log(`🔌 Database Port: ${this.connection.port}`);

    // Listen for connection events
    this.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    this.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    this.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
    });

    // Test a simple operation
    this.testDatabaseOperation();
  }

  private async testDatabaseOperation() {
    try {
      console.log('🧪 Testing database operation...');
      
      if (!this.connection.db) {
        console.log('❌ Database not available');
        return;
      }
      
      // Simple ping to test connection
      const admin = this.connection.db.admin();
      const result = await admin.ping();
      
      if (result.ok === 1) {
        console.log('✅ Database ping successful - Connection is working!');
        
        // List collections to verify access
        const collections = await this.connection.db.listCollections().toArray();
        console.log(`📋 Available collections: ${collections.map(c => c.name).join(', ') || 'No collections found'}`);
        
        // Check database stats
        const stats = await this.connection.db.stats();
        console.log(`💾 Database stats: ${stats.collections} collections, ${stats.objects} documents`);
        
      } else {
        console.log('❌ Database ping failed');
      }
    } catch (error: any) {
      console.error('❌ Database operation failed:', error.message);
    }
  }

  // Method to manually check connection status
  getConnectionStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return {
      state: states[this.connection.readyState],
      stateNumber: this.connection.readyState,
      host: this.connection.host,
      name: this.connection.name,
      port: this.connection.port,
      isConnected: this.connection.readyState === 1
    };
  }
}
