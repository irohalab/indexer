import { Container } from 'inversify';
import 'reflect-metadata';
import { ConfigManager } from './config';
import { BangumiMoe } from './scraper/bangumi-moe';
import { DmhyScraper } from './scraper/dmhy';
import { DBStore } from './storage/db-store';
import { PersistentStorage, Scraper, TYPES } from './types';

const config = ConfigManager.getInstance();
config.load();

const container = new Container();

let store: PersistentStorage<number|string>;

switch (config.mode) {
    case ConfigManager.DMHY:
        container.bind<PersistentStorage<number>>(TYPES.PersistentStorage).to(DBStore).inSingletonScope();
        container.bind<Scraper>(TYPES.Scraper).to(DmhyScraper).inSingletonScope();
        store = container.get<PersistentStorage<number>>(TYPES.PersistentStorage);
        break;
    case ConfigManager.BANGUMI_MOE:
        container.bind<PersistentStorage<string>>(TYPES.PersistentStorage).to(DBStore).inSingletonScope();
        container.bind<Scraper>(TYPES.Scraper).to(BangumiMoe).inSingletonScope();
        store = container.get<PersistentStorage<string>>(TYPES.PersistentStorage);
        break;
    default:
        throw new Error('Mode is not supported yet');
}

const scraper = container.get<Scraper>(TYPES.Scraper);

(async () => {
    await store.onStart();
    await scraper.start();
    await scraper.end();
    await store.onEnd();
})().catch((e) => {
    console.error(e ? e.stack : 'unknown error');
});
