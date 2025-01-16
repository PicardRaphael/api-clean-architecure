// Enable decorators
import 'reflect-metadata';

// Enable env config
import 'dotenv/config';

// Inject dependencies
import './infrastructure/adapters/adapter.di';

// Start API
import './infrastructure/api';
