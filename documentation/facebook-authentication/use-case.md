# Facebook Authentication

## Data:
* Access Token

> ## Main Flow
1. Get data (name, email, facebook id) from facebook's API
2. Query for an existing user with the email received
3. Create a user account with received data from facebook's API
4. Create an access token from the user id with an expiration time of 30 minutes
5. Return the access token created

> ## Alternative flow: user already exists
3. Update the user account with data from facebook's API (facebook id, name)

> ## Exception flow: invalid or expired token
1. Return authentication error
