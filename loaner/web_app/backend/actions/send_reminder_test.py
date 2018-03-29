# Copyright 2018 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for backend.actions.send_reminder."""

import mock

from loaner.web_app.backend.lib import send_email  # pylint: disable=unused-import
from loaner.web_app.backend.models import device_model
from loaner.web_app.backend.models import event_models
from loaner.web_app.backend.testing import loanertest


class SendReminderTest(loanertest.ActionTestCase):
  """Test the SendReminder Action class."""

  def setUp(self):
    self.testing_action = 'send_reminder'
    super(SendReminderTest, self).setUp()

  def test_run_no_device(self):
    self.assertRaisesRegexp(  # Raises generic because imported != loaded.
        Exception, '.*did not receive a device.*', self.action.run)

  def test_run_no_next_reminder(self):
    device = device_model.Device(serial_number='123456', chrome_device_id='123')
    self.assertRaisesRegexp(  # Raises generic because imported != loaded.
        Exception, '.*without next_reminder.*', self.action.run, device=device)

  def test_run_no_event(self):
    device = device_model.Device(  # Raises generic because imported != loaded.
        serial_number='123456', next_reminder=device_model.Reminder(level=0))
    self.assertRaisesRegexp(
        Exception, '.*no ReminderEvent.*', self.action.run, device=device)

  @mock.patch('__main__.send_email.send_user_email')
  def test_run_success(self, mock_sendemail):
    device = device_model.Device(
        serial_number='123456', chrome_device_id='123',
        next_reminder=device_model.Reminder(level=0))
    reminder_event = event_models.ReminderEvent.create(0)
    reminder_event.template = 'fake_template_name'
    self.assertFalse(device.last_reminder)

    self.action.run(device=device)
    mock_sendemail.assert_called_with(device, 'fake_template_name')
    device = device.key.get()
    self.assertTrue(device.last_reminder)

if __name__ == '__main__':
  loanertest.main()
