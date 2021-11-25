#!/usr/bin/env -S deno run --allow-net

console.log(`
/**
 * NOTE: This file is generated using other generated files as an input.
 * If something in this file needs to changed, try changing the generator instead.
 *
 * This file includes structures from https://github.com/DataDog/datadog-api-client-typescript
 *
 * Unless explicitly stated otherwise all files in that repository are licensed under the Apache-2.0 License.
 * This product includes software developed at Datadog (https://www.datadoghq.com/).
 * Copyright 2020-Present Datadog, Inc.
 */
`);

// const base = "http://localhost:8000/packages/datadog-api-client-v1/models/";
const base = "https://raw.githubusercontent.com/DataDog/datadog-api-client-typescript/master/packages/datadog-api-client-v1/models/";

const todo = new Set<string>();

async function process(filename: string) {
  console.error(`// ${filename}`);
  const raw = await fetch(`${base}${filename}.ts`).then(x => x.text());

  const imports = raw.matchAll(/^import .+ from "\.\/(.+)";/gm);
  for (const imported of imports) {
    todo.add(imported[1]);
  }

  const exportMatch = raw.match(/^export /m);
  let body = raw.slice(exportMatch?.index);

  const staticMatch = body.match(/^  "unparsedObject"/m);
  if (staticMatch) {
    body = body.slice(0, staticMatch.index! - 1) + '}\n';
  }
  body = body.replace(/^export class /m, 'export interface ');
  body = body.replace(/^  \| UnparsedObject/m, '');

  if (body.startsWith(`export type ${filename}`) && body.match(/^export const /m)) {
    const values = Array.from(body.matchAll(/^export const [^ ]+ = (".+");$/gm)).map(x => x[1]);
    if (values.length == 1) {
      console.log(`export type ${filename} = ${values[0]};`);
    } else {
      console.log(`export type ${filename} =`);
      for (const value of values) {
        console.log(`| ${value}`);
      }
      console.log(`;`);
    }
    console.log('');

  } else {
    body = body.replace(/^  "([^"]+)"\??:/gm,
      x => x.replace(/[A-Z]/g,
        y => `_${y.toLowerCase()}`));
    console.log(body);
  }
}

for (const seed of Deno.args) {
  todo.add(seed);
}

for (const ref of todo) {
  if (ref == 'ObjectSerializer') continue;
  await process(ref);
}
