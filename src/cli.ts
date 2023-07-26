import fs from 'fs';
import path from 'path';
import { loadConfig } from './config';
import { loadAndParseProtos } from './load';
import { ProtoToTypeScriptGenerator } from './generator';

interface Args {
  cwd: string;
}

export async function cli({ cwd }: Args) {
  try {
    const config = await loadConfig();
    const root = await loadAndParseProtos(cwd, config);
    const generator = new ProtoToTypeScriptGenerator(config, root);

    const typeDefinitionsByFile = generator.generateTypeDefinitionsByFile();

    for (const tsFile of typeDefinitionsByFile) {
      fs.mkdirSync(path.dirname(path.join(cwd, tsFile.path)), { recursive: true });
      fs.writeFileSync(path.join(cwd, tsFile.path), tsFile.content);

      console.log(`Successfully wrote ${tsFile.path}`);
    }
  } catch (e) {
    console.error(e);
  }
}
