# Twitter API

live demo:
https://blooming-earth-14186.herokuapp.com


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
    2. setup oauth callback url, keys and tokens under `Projects & Apps`:
        https://developer.twitter.com/en/portal/dashboard

2. postgres
        https://devcenter.heroku.com/articles/heroku-postgresql#provisioning-heroku-postgres
        ```
        heroku addons:create heroku-postgresql:hobby-dev
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
            - DATABASE_URL          - postgres database url
            - TWITTER_API_KEY       - consumer keys
            - TWITTER_SECRET        - consumer secret
            - TWITTER_TOKEN         - Bearer Token
