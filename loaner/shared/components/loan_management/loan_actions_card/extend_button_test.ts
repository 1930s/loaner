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

import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {ExtendMock} from '../../../testing/mocks';
import {Extend} from '../../extend';

import {LoanActionsCardModule} from './index';

@Component({
  template: `
  <loaner-loan-actions-card>
    <loan-button extendButton
                 [canExtend]="canExtend()"
                 [dueDate]="dueDate"
                 [maxExtendDate]="maxExtendDate"
                 (done)="onExtended($event)"></loan-button>
  </loaner-loan-actions-card>`,
})
class ExtendButtonComponent {
  dueDate = new Date(2018, 1, 1);
  maxExtendDate = new Date(2018, 1, 3);
  canExtend() {
    return true;
  }
  onExtended(newDate: string) {}
}

describe('LoanActionsCardComponent ExtendButton', () => {
  let app: ExtendButtonComponent;
  let fixture: ComponentFixture<ExtendButtonComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    TestBed
        .configureTestingModule({
          declarations: [
            ExtendButtonComponent,
          ],
          imports: [
            BrowserAnimationsModule,
            LoanActionsCardModule,
            RouterTestingModule,
          ],
          providers: [
            {provide: Extend, useClass: ExtendMock},
          ],
        })
        .compileComponents();

    fixture = TestBed.createComponent(ExtendButtonComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('renders extend button.', () => {
    const buttons = compiled.querySelectorAll('button');
    expect(buttons).toBeDefined();
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain('Extend');
  });

  it('renders a disabled extend button if canExtend is false.', () => {
    spyOn(app, 'canExtend').and.returnValue(false);
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
    const button = compiled.querySelector('button');
    expect(button!.getAttribute('disabled')).toBeDefined();
  });

  it('calls extend function after is clicked.', () => {
    spyOn(app, 'onExtended');
    const button = compiled.querySelector('button');

    button!.dispatchEvent(new Event('click'));
    expect(app.onExtended).toHaveBeenCalled();
  });
});
