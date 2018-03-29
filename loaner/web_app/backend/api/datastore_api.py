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

"""The entry point for the Datastore methods."""

from protorpc import message_types

from loaner.web_app.backend.api import loaner_endpoints
from loaner.web_app.backend.api import root_api
from loaner.web_app.backend.api.messages import datastore_message
from loaner.web_app.backend.lib import datastore_yaml


@root_api.ROOT_API.api_class(resource_name='datastore', path='datastore')
class DatastoreApi(root_api.Service):
  """Datastore API service class."""

  @loaner_endpoints.authed_method(
      datastore_message.ImportYamlRequest,
      message_types.VoidMessage,
      name='import',
      path='import',
      http_method='POST',
      permission='datastore_import')
  def datastore_import(self, request):
    """Datastore import request for the Datastore API."""
    self.check_xsrf_token(self.request_state)
    datastore_yaml.import_yaml(request.yaml, wipe=False)
    return message_types.VoidMessage()
