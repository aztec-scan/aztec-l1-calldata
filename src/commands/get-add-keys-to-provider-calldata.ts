import { NodeInfo } from "@aztec/aztec.js";
import { getAddressFromPrivateKey } from "@aztec/ethereum";
import { encodeFunctionData, formatEther, getAddress, parseEther } from "viem";
import { getEthereumClient, getProviderId, getStakingRegistryAddress } from "../components/ethereumClient.js";
import { AttesterRegistration, DirData, HexString, MOCK_REGISTRY_ABI } from "../types.js";
// cast send $STAKING_REGISTRY_ADDRESS \
//   "addKeysToProvider(uint256,(address,(uint256,uint256),(uint256,uint256,uint256,uint256),(uint256,uint256))[])" \
//   $YOUR_PROVIDER_IDENTIFIER \
//   "[(0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb,(12345,67890),(11111,22222,33333,44444),(98765,43210))]" \
//   --rpc-url $RPC_URL \
//   --private-key $ADMIN_PRIVATE_KEY

// const command = async (nodeInfo: NodeInfo, dirData: DirData, providerAdmin: string) => {
//   const stakingRegistryAddress = getStakingRegistryAddress(nodeInfo)
//   const providerAdminAddress = getAddress(providerAdmin);
//   const rewardsRecipientAddress = providerAdminAddress; // For simplicity, using the same address
//   const comissionBasisPoints = DEFAULT_COMISSION_RATE_PERCENTAGE * 100; // Convert percentage to basis points
//   const callData = {
//     contractToCall: stakingRegistryAddress,
//     callData: encodeFunctionData({
//       abi: MOCK_REGISTRY_ABI,
//       functionName: "registerProvider",
//       args: [
//         providerAdminAddress,
//         comissionBasisPoints,
//         rewardsRecipientAddress,
//       ]
//     })
//   };
//   const providerId = await getProviderId(providerAdminAddress, nodeInfo);
//   if (providerId >= 0n) {
//     console.log("Provider already registered on-chain.");
//   } else {
//     console.log("REGISTER PROVIDER CALL DATA:", JSON.stringify(callData, null, 2));
//   }
// }
//
// #!/bin/bash

// # Check for keystore file argument
// if [ $# -lt 1 ]; then
//   echo "Usage: $0 <keystore-json-file>"
//   exit 1
// fi
//
// KEYSTORES_FILE="$1"
//
// # CONFIGURATION -- edit these as needed
// STAKING_REGISTRY_ADDRESS="0xc3860c45e5F0b1eF3000dbF93149756f16928ADB" # testnet staking registry
// YOUR_PROVIDER_IDENTIFIER="2" # your provider ID
// RPC_URL="" # configure correct ETH network
// ADMIN_PRIVATE_KEY="" # Admin private key, specified in provider register
//
// keys_array_str="["
// first=1
//
// json_entries=$(jq -c '.[]' "$KEYSTORES_FILE")
//
// while IFS= read -r entry; do
//   attester=$(jq -r '.attester'<<<"$entry")
//
//   pkG1_x=$(jq -r '.publicKeyG1.x'<<<"$entry")
//   pkG1_y=$(jq -r '.publicKeyG1.y'<<<"$entry")
//
//   pkG2_x0=$(jq -r '.publicKeyG2.x0'<<<"$entry")
//   pkG2_x1=$(jq -r '.publicKeyG2.x1'<<<"$entry")
//   pkG2_y0=$(jq -r '.publicKeyG2.y0'<<<"$entry")
//   pkG2_y1=$(jq -r '.publicKeyG2.y1'<<<"$entry")
//
//   pop_x=$(jq -r '.proofOfPossession.x'<<<"$entry")
//   pop_y=$(jq -r '.proofOfPossession.y'<<<"$entry")
//
//   strip0x() {
//     echo "$1" | sed 's/^0x//'
//   }
//
//   attester_str=$attester
//   pkG1_x_str="0x$(strip0x $pkG1_x)"
//   pkG1_y_str="0x$(strip0x $pkG1_y)"
//   pkG2_x0_str="0x$(strip0x $pkG2_x0)"
//   pkG2_x1_str="0x$(strip0x $pkG2_x1)"
//   pkG2_y0_str="0x$(strip0x $pkG2_y0)"
//   pkG2_y1_str="0x$(strip0x $pkG2_y1)"
//   pop_x_str="0x$(strip0x $pop_x)"
//   pop_y_str="0x$(strip0x $pop_y)"
//
//   tuple="($attester_str,($pkG1_x_str,$pkG1_y_str),($pkG2_x0_str,$pkG2_x1_str,$pkG2_y0_str,$pkG2_y1_str),($pop_x_str,$pop_y_str))"
//
//   if [ $first -eq 1 ]; then
//     keys_array_str+="$tuple"
//     first=0
//   else
//     keys_array_str+=",$tuple"
//   fi
// done <<< "$json_entries"
//
// keys_array_str+="]"
//
// echo "cast send $STAKING_REGISTRY_ADDRESS \
// \"addKeysToProvider(uint256,(address,(uint256,uint256),(uint256,uint256,uint256,uint256),(uint256,uint256))[])\" \
// $YOUR_PROVIDER_IDENTIFIER \
// \"$keys_array_str\" \
// --rpc-url $RPC_URL \
// --private-key $ADMIN_PRIVATE_KEY"
//
//   {
//   [{
//     "attester": "0x0f3dB0A80d42f5E58B181deeCFBf10fBe28f1Cdd",
//     "publicKeyG1": {
//       "x": "0x148685b31fa7d698a21c8143d98ce123811020aab3497dd3b38d84c76f64e677",
//       "y": "0x257c1c0b68300b6ffd7520420107212d0798a7718736e2ff084718487dfa5664"
//     },
//     "publicKeyG2": {
//       "x0": "0x26f095fc9660adf0f732d4a8916215a18cda9d8e510369d1e1a0077e90c5d533",
//       "x1": "0x13556de55d882fba939eed556351579d00ef9c97a0893ac49ca5c5bdeb3853d5",
//       "y0": "0x0fccbe8e8cc7d0403a3b9da7cc5b97bfbdd6840ea93d1fa3bb2ed5227bde30b3",
//       "y1": "0x1c7c0deefd428e8a0424b0931a68dcb973d2914bb09f5dc28313b92519363d84"
//     },
//     "proofOfPossession": {
//       "x": "0x1afb9b2b4952d9d7a780b387e03e614c2ea54e4897b3a3a92394025812e2ef1f",
//       "y": "0x2df2f1451fee611904a2b16cd6066f8f490653718b1032a806c2b3853f6a0b6c"
//     }
//   },
//   {
//     "attester": "0x1C132AaaA43B1F74d80390067a372784df32A466",
//     "publicKeyG1": {
//       "x": "0x12915ca2711f3cb3e9bf87b504049b4c24c240773db390811b8f91b81321621b",
//       "y": "0x07dbcca096a4812522ea65864044ae724f397ccfea66dfa429acfc60291fa107"
//     },
//     "publicKeyG2": {
//       "x0": "0x15046eed9b323a2ef3599d501fe4cf7aa1a0bc9367348c557b01f15244d2e486",
//       "x1": "0x14b8dfe527c5a02fee5934b13b9965ecffa38256b20f08987aeff0655612e239",
//       "y0": "0x2976304655e6365f23a0c827a2449ca108d9dee3ebf5b702566f3d8855360d45",
//       "y1": "0x29253586deb065d567a88ef625941184f10778bd102a53399e54df02a7697231"
//     },
//     "proofOfPossession": {
//       "x": "0x1feb4febe6581fc64c043ac4169309aa3fc0b179b7a27cfe23dcdff86b8c46c1",
//       "y": "0x1771cfe55967c9d89492bde93a9ce7d3c784fc3243e2bd1ee7926d2e65a38ac7"
//     }
//   }
// ]
const command = async (nodeInfo: NodeInfo, dirData: DirData, providerAdminAddress: `0x${string}`) => {
  const providerId = await getProviderId(providerAdminAddress, nodeInfo);

  if (providerId < 0n) {
    console.error("Provider not registered. Please register the provider first.");
    return;
  }

  console.log(`Provider ID: ${providerId}`);

  // TODO: check which attesters are already added to rollup
  // TODO: check which attesters are in rollup queue
  // TODO: check attesters in stakingReg queue

  if (dirData.attesterRegistrations.length === 0) {
    console.log("No attester registration files found.");
    return;
  }

  // Process each registration file separately
  for (const attesterRegistration of dirData.attesterRegistrations) {
    console.log(`\n=== Processing: ${attesterRegistration.path} ===`);
    
    if (attesterRegistration.data.length === 0) {
      console.log("No attester registrations found in this file.");
      continue;
    }
    
    console.log(`Found ${attesterRegistration.data.length} attester registrations`);
    
    // Transform attester data to match ABI structure
    const keyStores = attesterRegistration.data.map(attesterData => ({
      attester: getAddress(attesterData.attester),
      publicKeyG1: {
        x: BigInt(attesterData.publicKeyG1.x),
        y: BigInt(attesterData.publicKeyG1.y),
      },
      publicKeyG2: {
        x0: BigInt(attesterData.publicKeyG2.x0),
        x1: BigInt(attesterData.publicKeyG2.x1),
        y0: BigInt(attesterData.publicKeyG2.y0),
        y1: BigInt(attesterData.publicKeyG2.y1),
      },
      proofOfPossession: {
        x: BigInt(attesterData.proofOfPossession.x),
        y: BigInt(attesterData.proofOfPossession.y),
      },
    }));

    const callData = {
      contractToCall: getStakingRegistryAddress(nodeInfo),
      callData: encodeFunctionData({
        abi: MOCK_REGISTRY_ABI,
        functionName: "addKeysToProvider",
        args: [
          providerId,
          keyStores,
        ]
      })
    };
    
    console.log(`\nADD KEYS TO PROVIDER CALL DATA for ${attesterRegistration.path}:`);
    console.log(JSON.stringify(callData, null, 2));
    
    // Also log individual attester addresses for reference
    console.log(`\nAttester addresses from ${attesterRegistration.path}:`);
    attesterRegistration.data.forEach((attester, index) => {
      console.log(`${index + 1}. ${attester.attester}`);
    });
  }
};

export default command;
