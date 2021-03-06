/*
 * Copyright 2020 IROHA LAB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { init, captureMessage as sentryCaptureMessage, captureException as sentryCaptureException } from '@sentry/node';
const DSN = process.env.SENTRY_DSN;
if (DSN) {
    // tslint:disable-next-line
    const { version } = require('../package.json');
    init({ dsn: DSN, release: `indexer@v${version}` });
}

export function captureException(err: any) {
    if (DSN) {
        sentryCaptureException(err);
    }
}

export function captureMessage(msg: any) {
    if (DSN) {
        sentryCaptureMessage(msg);
    }
}
