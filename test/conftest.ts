/**
 * Copyright IBM Corporation 2025
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Setup code for the test session.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import extract from 'extract-zip';
import {beforeAll, afterAll } from "bun:test";


/*
 * Set up sample applications for testing
 * This is a one-time setup. Daytrader 8 will be downloaded and extracted
 */

export let dayTraderApp: string;

beforeAll(async () => {
    const javaSampleAppsDir = path.join(__dirname, "test-applications", "java");
    const appZipFile = path.join(javaSampleAppsDir, "sample.daytrader8-1.2.zip");
    const extractedDir = path.join(javaSampleAppsDir, "sample.daytrader8-1.2");
    await extract(appZipFile, {dir: javaSampleAppsDir});

    /**
     * I am just hardcoding the extracted directory name for now. The extracted directory name would follow GitHub's
     * repository zip extraction convention. The extracted directory would be named in the format {repo-name}-{tag}.
     * For the URL: https://github.com/OpenLiberty/sample.daytrader8/archive/refs/tags/v1.2.zip, the repository name
     * is sample.daytrader8 and the tag is v1.2. So the extracted directory would be sample.daytrader8-1.2 (note that
     * GitHub typically removes the "v" prefix from version tags in the extracted directory name).
     */
    // Set the dayTraderApp variable to the extracted directory
    dayTraderApp = extractedDir;
})

/**
 * Tear down the test environment
 * Remove the daytrader application directory (but keep the zip file)
 */
afterAll(async () => {
    if (dayTraderApp) {
        fs.rmSync(dayTraderApp, {recursive: true, force: true});
    }
})

