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
 * Contains setup code for the test environment.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as https from 'https';
import extract from 'extract-zip';
import * as rimraf from 'rimraf';

/**
 * A quick function to download and extract a zip file from a URL.
 */
async function downloadAndExtractZipFile(url: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        // Let's first create a directory to store the zip file if it doesn't exist
        const dirName = path.dirname(filePath);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }

        const file = fs.createWriteStream(filePath);
        https.get(url, res => {
            res.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    // Now that the zip file is downloaded, let's extract it
                    // @ts-ignore
                    extract(filePath, { dir: dirName }, (err: any) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            }).on('error', (err: any) => {
                fs.unlink(filePath, () => reject(err)); // Delete the file if there's an error
            });
        })
    })
}