import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();

    const database = mongoose.connection.db;

    if (!database) {
      throw new Error('MongoDB database connection is not available');
    }

    const pingResult = await database.admin().command({ ping: 1 });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully connected to MongoDB Atlas',
        database: database.databaseName,
        ping: pingResult,
        connectionState: mongoose.connection.readyState,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('MongoDB test connection failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'MongoDB connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
      }
    );
  }
}

export async 