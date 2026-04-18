import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      name: 'cvpilot-backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
