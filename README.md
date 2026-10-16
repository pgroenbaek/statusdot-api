# statusdot-api

A simple API to manage and keep track of an online status. Built with Cloudflare Workers and Cloudflare KV.

## Setting up the Cloudflare workers instance

Complete the following steps in the Cloudflare Dashboard:

1. Create a Cloudflare workers app

   - Go to the Workers dashboard and create a new worker

2. Set up a KV namespace

   - Go to the Workers KV dashboard and create a new namespace
   - Copy the namespace ID and add it to the `kv_namespaces` section of your `wrangler.toml` file

### Configuring `wrangler.toml`

Next configure your `wrangler.toml` file to include the necessary settings.

Replace `<PUT_YOUR_WORKERS_APP_NAME_HERE>`, `<PUT_YOUR_KV_NAMESPACE_ID_HERE>`, and `<PUT_YOUR_ORIGINS_HERE>` with your actual values.

```
name = "<PUT_YOUR_WORKERS_APP_NAME_HERE>"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]
main = "src/index.js"

[[kv_namespaces]]
id = "<PUT_YOUR_KV_NAMESPACE_ID_HERE>"
binding = "STATUSDOT_KV"

[vars]
ALLOWED_CORS_ORIGINS = [
  <PUT_YOUR_ORIGINS_HERE>
]
```

## Deploying

To deploy your Workers app, run the following command:

```
wrangler deploy
```

### Defining an API key

When the Workers App is deployed you need to create an API key to be able to call the protected endpoints later.

Go to the Cloudflare dashboard and find the settings of the Workers App. Then do the following:

1. Click on the "Add variable" button.

2. Enter `API_KEY` as the name of the variable.

3. Enter whatever you want the key to be as the value.

4. Check "Secret".

5. And finally click "Add variable and deploy" to apply it.

You can then use this API key in the `x-api-key` header of your requests to the protected endpoints.

## Using the API

This is a list of available endpoints. The API supports setting statuses for multiple devices. The overall global status is combined from all devices, for example the global status is resolved as online if any device status is online.

| Endpoint                   | Method | Protected?               |
| ---------------------------| ------ | ------------------------ |
| `/api/status`              | `GET`  | No                       |
| `/api/status.svg`          | `GET`  | No                       |
| `/api/status/:deviceName`  | `GET`  | Yes - `x-api-key` header |
| `/api/status/:deviceName`  | `PUT`  | Yes - `x-api-key` header |

An example of an application using the API to manage a status is provided in the [Budgie Statusdot Applet](https://github.com/pgroenbaek/budgie-statusdot-applet).

### Setting and maintaining a status

By default, statuses expire after 7 minutes after which the status is shown as offline. You can change this by adjusting `DEFAULT_STATUS_EXPIRATION_SECONDS` in [status.js](/src/models/status.js).

You will therefore need to create something that pings the set status endpoint, e.g. every 5 minutes, to maintain a status that is not offline.

To set/update a status, you can send a PUT request to `/api/status/<devicename>`:

```bash
curl -X PUT "https://<YOUR_BASE_URL>/api/status/<YOUR_DEVICE_NAME>" \
  -H "Content-Type: application/json" \
  -H "x-api-key: <YOUR_API_KEY_HERE>" \
  -d '{
    "status": 1,
    "expirationTtl": 600
  }'
```

The `expirationTtl` parameter is optional, it overrides the `DEFAULT_STATUS_EXPIRATION_SECONDS` setting when present.

The resulting response is a json object with the `device` field set to the device name, the `status` field set to the new status, and the `updated_at` field set to the timestamp of the last update. For example:

```json
{
    "device": "desktop",
    "status": 1,
    "updated_at": 1792160683085
}
```

### Getting status of a device

To get the status of a device, you can send a GET request to `/api/status/<devicename>`:

```bash
curl -X GET "<YOUR_BASE_URL>/api/status" \
  -H "x-api-key: <YOUR_API_KEY_HERE>"
```

The response is a json object with the `device` field set to the device name, the `status` field set to the current status, and the `updated_at` field set to the timestamp of the last update. For example:

```json
{
    "device": "desktop",
    "status": 1,
    "updated_at": 1792160683085
}
```

### Getting the current overall status across devices

To get the current overall status across devices as json, you can use the following endpoint:

```bash
curl -X GET "<YOUR_BASE_URL>/api/status"
```

The response is a json object with the `status` field set to the current overall status. For example:

```json
{
    "status": 1
}
```

### Generating a badge with the current status

The following endpoint returns an svg badge with the current status created by [badge-maker](https://www.npmjs.com/package/badge-maker).

You can customize the style by adding a query parameter `style` to the URL.

```bash
curl -X GET "<YOUR_BASE_URL>/api/status.svg?style=flat-square"
```

The endpoint supports the following styles:
- `flat`
- `flat-square`
- `plastic`
- `for-the-badge`

Examples of the `flat-square` style:

<picture>
  <img alt="Online SVG Example" src="/examples/online.svg" />
</picture>
<picture>
  <img alt="Offline SVG Example" src="/examples/offline.svg" />
</picture>
<br><br>

Colors and labels can be adjusted in [status.js](/src/models/status.js).

## License

The source code of this project is licensed under the [GNU General Public License v3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl-3.0.html). You are free to use, modify, and distribute the code under the terms of this license.

See the [LICENSE](/LICENSE) file for the full license text.

