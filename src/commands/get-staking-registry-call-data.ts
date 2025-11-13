import { NodeInfo } from "@aztec/aztec.js";
import { getAddressFromPrivateKey } from "@aztec/ethereum";
import { formatEther, parseEther } from "viem";
import { getEthereumClient } from "../components/ethereumClient.js";
import { DirData, HexString } from "../types.js";

const getRegistryAddress = (nodeInfo: NodeInfo): HexString => {
  if (nodeInfo.l1ChainId === 11155111) {
    return "0xc3860c45e5F0b1eF3000dbF93149756f16928ADB";
  } else if (nodeInfo.l1ChainId === 1) {
    throw "mainnet address not yet known";
  } else {
    throw `unsupported chain id: ${nodeInfo.l1ChainId}`;
  }
}

const command = async (nodeInfo: NodeInfo, dirData: DirData) => {
  // TODO
}

export default command;
