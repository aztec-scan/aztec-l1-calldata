import { NodeInfo } from "@aztec/aztec.js";
import { getAddressFromPrivateKey, GSEContract, ViemPublicClient } from "@aztec/ethereum";
import { getEthereumClient, getRollupContract } from "../components/ethereumClient.js";
import { AttesterRegistration, DirData, HexString } from "../types.js";
import { writeFile } from "../utils/fileOperations.js";

const get0xString = (bn: bigint): HexString => {
  return `0x${bn.toString(16).padStart(64, "0")}`;
}

const ATTESTER_REGISTRATION_FILE_PREFIX = "regs";

const command = async (nodeInfo: NodeInfo, dirData: DirData, attesterDirPath: string) => {
  const client = getEthereumClient(nodeInfo.l1ChainId);
  const rollupContract = getRollupContract();
  const keystoresMissingRegistrationFiles: DirData["keystores"] = dirData.keystores.filter(ks => {
    if (dirData.attesterRegistrations.find(ar => ar.id === ks.id)) {
      return false;
    }
    return true;
  });
  const gse = new GSEContract(client as ViemPublicClient, await rollupContract.read.getGSE());
  for (const keystore of keystoresMissingRegistrationFiles) {
    const attesterRegistrations: AttesterRegistration[] = [];
    for (const validator of keystore.data.validators) {
      const registrationTuple = await gse.makeRegistrationTuple(BigInt(validator.attester.bls));
      attesterRegistrations.push({
        attester: getAddressFromPrivateKey(validator.attester.eth),
        publicKeyG1: {
          x: get0xString(registrationTuple.publicKeyInG1.x),
          y: get0xString(registrationTuple.publicKeyInG1.y)
        },
        publicKeyG2: {
          x0: get0xString(registrationTuple.publicKeyInG2.x0),
          x1: get0xString(registrationTuple.publicKeyInG2.x1),
          y0: get0xString(registrationTuple.publicKeyInG2.y0),
          y1: get0xString(registrationTuple.publicKeyInG2.y1)
        },
        proofOfPossession: {
          x: get0xString(registrationTuple.proofOfPossession.x),
          y: get0xString(registrationTuple.proofOfPossession.y)
        }
      });
    }
    await writeFile(`${attesterDirPath}/${ATTESTER_REGISTRATION_FILE_PREFIX}${keystore.id}.json`, JSON.stringify(attesterRegistrations, null, 2));
  }
}
// TODO: add another command-file where you go through ALL attester-files and checks on chain status and print calldata if not already registered on staking registry

export default command;
