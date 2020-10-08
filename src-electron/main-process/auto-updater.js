import * as path from "path";
import * as fs from "fs-extra";
import { dialog } from "electron";
import isDev from "electron-is-dev";
import { autoUpdater } from "electron-updater";
import { app } from "electron";

let isUpdating = false;

/*
  Check if we have the required files to auto update.
  These files won't exist inside certain formats such as a linux deb file.
*/
async function canAutoUpdate() {
  const { isPackaged } = app;

  // On a production app, we need to use resources path to check for the file
  if (isPackaged && !process.resourcesPath) {
    return false;
  }

  // Taken from: https://github.com/electron-userland/electron-builder/blob/d4feb6d3c8b008f8b455c761d654c8088f90d8fa/packages/electron-updater/src/ElectronAppAdapter.ts#L25
  const updateFile = isPackaged ? "app-update.yml" : "dev-app-update.yml";
  const basePath = isPackaged && process.resourcesPath ? process.resourcesPath : app.getAppPath();
  const appUpdateConfigPath = path.join(basePath, updateFile);

  return new Promise(resolve => {
    try {
      // tslint:disable-next-line: non-literal-fs-path
      const exists = fs.existsSync(appUpdateConfigPath);
      resolve(exists);
    } catch (e) {
      resolve(false);
    }
  });
}

async function checkForUpdate(getMainWindow, onQuitAndInstall) {
  // Disable for development
  if (isDev) {
    return;
  }

  if (isUpdating) {
    return;
  }

  const canUpdate = await canAutoUpdate();
  if (!canUpdate) {
    return;
  }

  autoUpdater.logger = console;

  try {
    // Get the update using electron-updater
    const info = await autoUpdater.checkForUpdates();
    if (!info || !info.downloadPromise) {
      console.info("auto-update: no update to download");

      return;
    }

    try {
      await info.downloadPromise;
    } catch (error) {
      await showCannotUpdateDialog(getMainWindow());
      throw error;
    }

    // Update downloaded successfully, we should ask the user to update
    console.info("auto-update: showing update dialog...");
    const shouldUpdate = await showUpdateDialog(getMainWindow());
    if (!shouldUpdate) {
      return;
    }

    console.info("auto-update: calling quitAndInstall...");
    if (onQuitAndInstall) {
      onQuitAndInstall(autoUpdater);
    }
  } catch (error) {
    console.error("auto-update error:", getPrintableError(error));
  } finally {
    isUpdating = false;
  }
}

function getPrintableError(error) {
  return error && error.stack ? error.stack : error;
}

async function showUpdateDialog(mainWindow) {
  const RESTART_BUTTON = 0;
  const LATER_BUTTON = 1;
  const options = {
    type: "info",
    buttons: ["Restart Wallet", "Later"],
    title: "Scala Electron Wallet update available",
    message: "There is a new version of Scala Electron Wallet available.",
    detail: "Press Restart Wallet to apply the update",
    defaultId: LATER_BUTTON,
    cancelId: RESTART_BUTTON
  };
  return new Promise(resolve => {
    dialog.showMessageBox(mainWindow, options, response => {
      resolve(response === RESTART_BUTTON);
    });
  });
}

async function showCannotUpdateDialog(mainWindow) {
  const options = {
    type: "error",
    buttons: ["Ok"],
    title: "Cannot update",
    message:
      "Scala Electron Wallet failed to update but there is a new version available. Please go to https://scala.network/ and install the new version manually."
  };

  return new Promise(resolve => {
    dialog.showMessageBox(mainWindow, options, () => {
      resolve();
    });
  });
}

export { checkForUpdate };
