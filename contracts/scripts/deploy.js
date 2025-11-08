const hre = require("hardhat");

async function main() {
  console.log("Deploying StreakTracker to Base chain...");

  const StreakTracker = await hre.ethers.getContractFactory("StreakTracker");
  const streakTracker = await StreakTracker.deploy();

  await streakTracker.waitForDeployment();

  const address = await streakTracker.getAddress();
  console.log("StreakTracker deployed to:", address);
  console.log("Save this address for frontend configuration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
