const axios = require("axios");
const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");
const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("🚀 ~ launch data was already loaded");
  } else {
    await populateLaunches();
  }
}

async function populateLaunches() {
  let launchDocs;
  try {
    const response = await axios.post(SPACEX_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    });
    launchDocs = response.data.docs;
  } catch (error) {
    console.log(
      "🚀 ~ file: launches.model.js:59 ~ populateLaunches ~ error:",
      error.message,
    );
    throw new Error("Sapcex launch data download failed");
  }
  console.log(
    "🚀 ~ file: launches.model.js:60 ~ populateLaunches ~ launchDocs:",
    launchDocs.length,
  );
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    await saveLaunch(launch);
  }
}

async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getAllLaunches(skip, limit) {
  let launchData = await launchesDB
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
  return launchData;
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
  return latestLaunch?.flightNumber
    ? latestLaunch?.flightNumber
    : DEFAULT_FLIGHT_NUMBER;
}

async function saveLaunch(launch) {
  try {
    await launchesDB.findOneAndUpdate(
      { flightNumber: launch.flightNumber },
      { $set: launch },
      { upsert: true },
    );
  } catch (error) {
    console.error(`Could not save launch - ${error}`);
  }
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet was found");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Nasa", "ISRO"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false },
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
