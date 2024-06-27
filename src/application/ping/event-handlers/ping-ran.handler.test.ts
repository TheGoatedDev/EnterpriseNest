// ping-ran.handler.spec.ts
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PingRanHandler } from '@/application/ping/event-handlers/ping-ran.handler';
import { PingRanEvent } from '@/application/ping/events/ping-ran.event';

describe('pingRanHandler', () => {
    let handler: PingRanHandler;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PingRanHandler],
        }).compile();

        handler = module.get<PingRanHandler>(PingRanHandler);
    });

    it('should be defined', () => {
        expect(handler).toBeDefined();
    });

    it('should handle PingRanEvent', () => {
        const logSpy = jest.spyOn(Logger.prototype, 'log');

        handler.handle(new PingRanEvent());

        expect(logSpy).toHaveBeenCalledWith(
            'PingRanEvent handled successfully',
        );
    });
});
