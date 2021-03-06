
# Environment Variables 


## General configuration

#### PORT

Port in which the node server will listen for incoming connections

#### PUBLIC_PATH

Server subpath over which the application will be served. May be empty if the application should load through relative urls, or a static path for loading through an absolute url. If not empty, it must start and end with a `/` character (such as `/map/`). Default: `''`

#### NODE_ENV

Environment in which the node server will run (production/development)



## Workspace

#### DEFAULT_WORKSPACE

Name/ID of the default workspace to be loaded from the API on the map. Will override `LOCAL_WORKSPACE`.

#### LOCAL_WORKSPACE

If set, should point to the local workspace to be loaded. 

## Feature flags

#### FEATURE_FLAG_EXTENDED_POLYGON_LAYERS

Enables polygon static layers click popups, polygon static layers color picker, polygon static layer labels + toggle layer labels

#### FEATURE_FLAG_SUBSCRIPTIONS

Enable usage of the "Subscription" feature.


## Boolean flags

#### COMPLETE_MAP_RENDER

If true, the map will display the header, and footer on the map page. If false, the app will only render the map (full window size) and the sidebar.

#### DISABLE_WELCOME_MODAL

Disable welcome modal. Typically enabled in a dev environment, disabled in prod.

#### REQUIRE_MAP_LOGIN

Boolean value to determine if the user needs to be logged in to access the map.

#### SHOW_BANNER

Display message contained in literals.json's `banner` in a dismissable banner on top of the map. Boolean value.

## Keys

#### GA_TRACKING_CODE

Google Analytics tracking code.

#### WELCOME_MODAL_COOKIE_KEY

Key used to read the welcome modal's url cookie. On load, the app will look for a cookie named with the specified key. If any cookie matches the WELCOME_MODAL_COOKIE_KEY and the url of the cookie is new, the html content will be loaded in a modal. EXAMPLE: If WELCOME_MODAL_COOKIE_KEY is set to GlobalFishingWatchNewsletter the cookie's name must also be GlobalFishingWatchNewsletter.

#### GOOGLE_API_KEY (deprecated)
#### MAPBOX_TOKEN (deprecated)


## Endpoints

#### TIMEBAR_DATA_URL

Endpoint where the JSON timebar data is hosted. Typically enabled as `/timebar/`.

#### V2_API_ENDPOINT

Endpoint of the API (vessel tiles, workspace, contact, etc)

#### SATELLITE_BASEMAP_URL (deprecated)

## Links

#### BLOG_URL

URL of the blog

#### MAP_URL

URL of the map on the main site

#### SITE_URL

URL of the main site

#### SHARE_BASE_URL

URL pattern used on the share feature. It must be of type http://your-site.com/?workspace={workspace_id}, where {workspace_id} will be replaced by the actual workspace ID. If omitted, will be built dynamically using current location.

