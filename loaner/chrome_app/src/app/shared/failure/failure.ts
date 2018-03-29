// Copyright 2018 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Component, Inject, Injectable} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import {DEV_MODE, LOGGING} from '../../config';
import {Background} from '../background_service';

/** Fail information for the user facing dialog */
export interface FailInfo {
  message: string;
  title: string;
}

/** Types of actions for a failure */
export enum FailAction {
  Ignore,
  Later,
  Quit,
}

/** Types of errors that can occur */
export enum FailType {
  Network,
  Other,
}

/**
 * Dialog that appears when a failure happens.
 */
@Component({
  selector: 'failure',
  templateUrl: './failure.ng.html',
})
export class FailureComponentDialog {
  get title() {
    return this.data.title || `Oops! Something went wrong`;
  }

  constructor(
      @Inject(MatDialogRef) public dialogRef:
          MatDialogRef<FailureComponentDialog>,
      @Inject(MAT_DIALOG_DATA) public data: FailInfo) {}

  closeDialog() {
    this.dialogRef.close();
  }
}

/**
 * Service to handle failures in the application.
 */
@Injectable()
export class Failure {
  readonly TOLERABLE_ERROR_COUNT = 2;
  errorCount = 0;

  constructor(public dialog: MatDialog, private bg: Background) {}

  /**
   * Register a failure/error and display a dialog to the user.
   * perform Auto-remediation actions depending on frequency of error.
   * @param message Error message to display to the user.
   * @param failType The type of failure.
   * @param failAction The action to be taken by the failure.
   * @param rawError Optional raw error message.
   */
  async register(
      message: string, failType: FailType, failAction: FailAction,
      rawError?: {}) {
    this.errorCount += 1;
    if (this.errorCount > this.TOLERABLE_ERROR_COUNT) {
      const quitMessage = `Since this has failed a couple of times the
application will now quit. If the issue persist contact your Administrator.`;
      this.openDialog(quitMessage, failAction);
    } else {
      this.openDialog(message, FailAction.Ignore);
    }

    if (DEV_MODE && LOGGING) {
      console.error(rawError);
    }
  }

  /**
   * Opens a dialog with a given failure message.
   * @param message text to display explaining the failure.
   */
  openDialog(
      message: string, failAction: FailAction = FailAction.Ignore,
      title?: string): void {
    const dialogRef = this.dialog.open(FailureComponentDialog, {
      data: {
        title,
        message: message || `Something weird has happened here.
Close this and we will be back shortly`,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.actionHandler(failAction);
    });
  }

  /**
   * Handles the failure actions when given a specific failure type.
   * @param failureType Type of action to be taken
   */
  actionHandler(failureType: FailAction) {
    if (failureType === FailAction.Ignore) {
      // Ignore the warning
    } else if (failureType === FailAction.Later) {
    } else if (failureType === FailAction.Quit) {
      // Close the application, network check will open again automatically.
      const viewName = chrome.app.window.current().id;
      this.bg.closeView(viewName);
    }
  }
}
