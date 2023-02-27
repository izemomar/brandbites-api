import { DataSource } from 'typeorm';
import { dataSourceConfig } from '@config/data-source-config';

export const dataSource = new DataSource(dataSourceConfig);
