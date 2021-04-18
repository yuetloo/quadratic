# Twitter API

live demo:
https://quadratic-trust.herokuapp.com/


# API
1. /users
    - list of top 10 users for leaderboard
2. /users/:username
    - user profile - vistor page
3. /search/:str
    - for autocomplete search

# Setup
1. twitter
    1. create a developer account at https://developer.twitter.com
    2. setup keys and tokens under `Projects & Apps`:
        https://developer.twitter.com/en/portal/dashboard
    3. setup oauth callback url in settings
        - Enable 3-legged OAuth

2. postgres
    1. how to provision postgres on heroku:
      - https://devcenter.heroku.com/articles/heroku-postgresql#provisioning-heroku-postgres

      ```
      heroku addons:create heroku-postgresql:hobby-dev
      ```

      - to get postgres url from heroku

      ```
      heroku pg:credentials:url DATABASE --app <appname>
      ```

2. heroku
    1. follow the heroku instruction to download heroku cli
        https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up

        ```
            heroku create
            git push heroku main
        ```
    2. setup config
        - go to https://dashboard.heroku.com app settings
        - click the `Reveal Config Vars` to setup these environment variables
            - DATABASE_URL                - postgres database url
            - TWITTER_CONSUMER_KEY        - consumer keys
            - TWITTER_CONSUMER_SECRET     - consumer secret
            - TWITTER_BEARER_TOKEN        - Bearer Token
            - TWITTER_ACCESS_TOKEN_KEY    - access token key
            - TWITTER_ACCESS_TOKEN_SECRET - access token secret

# Troubleshooting
1. Twitter callback url not setup
    - error: Desktop applications only support the oauth_callback value 'oob'/oauth/request_token
