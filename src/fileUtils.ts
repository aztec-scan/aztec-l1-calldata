import fs from "fs";
import { createRequire } from "module";
import path from "path";
const require = createRequire(import.meta.url);

export function getPackageVersion(pkgName: string): string {
  try {
    const entryPath = require.resolve(pkgName);

    let dir = path.dirname(entryPath);
    while (dir !== path.parse(dir).root) {
      const candidate = path.join(dir, "package.json");
      if (fs.existsSync(candidate)) {
        const pkg = JSON.parse(fs.readFileSync(candidate, "utf8"));
        return pkg.version;
      }
      dir = path.dirname(dir);
    }

    throw new Error(`No package.json found for ${pkgName}`);
  } catch (err) {
    console.warn(`⚠️ Could not resolve version for package "${pkgName}":`, err);
    return "unknown";
  }
}

type KeystoreData = {
  validators:
  {
    attester: {
      bls: string,
      eth: string
    }[],
  }[],
}

export type CuratedKeystoreData = {
  blsSecretKey: string,
  ethPrivateKey: string
}

export function getRelevantKeystoreData(keystorePath?: string): CuratedKeystoreData[] {
  const p = keystorePath || path.join(process.cwd(), "..", "keystore.json");
  console.log(`Using keystore path: ${p}`);
  const keystoreJson = fs.readFileSync(p, "utf8");
  const keystore: KeystoreData = JSON.parse(keystoreJson);
  if (!keystore.validators[0] || !keystore.validators[0].attester[0]) {
    throw new Error("Invalid keystore format");
  }
  return keystore.validators[0].attester.map((a: any) => ({
    blsSecretKey: a.bls,
    ethPrivateKey: a.eth
  }));
}
