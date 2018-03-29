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

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {DeviceInfoCardModule} from '../../components/device_info_card';
import {UserLoansTableModule} from '../../components/user_loans_table';
import {UserView} from './user_view';

export * from './user_view';

@NgModule({
  declarations: [
    UserView,
  ],
  exports: [
    UserView,
  ],
  imports: [
    BrowserModule,
    DeviceInfoCardModule,
    UserLoansTableModule,
  ],
})
export class UserViewModule {}
