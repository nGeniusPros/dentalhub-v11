import { MCPRequest } from './protocol/types';

export interface Adapter {
  processRequest(request: MCPRequest): Promise<unknown>;
}