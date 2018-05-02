www.burakince.net
===================

1. Install jekyll dependencies
   ```sh
   $ gem install jekyll
   ```

2. Install i18n dependency
   ```sh
   $ gem install i18n
   ```

3. Serve the site for changes
   ```sh
   $ jekyll serve
   ```

4. Open <http://localhost:4000/> to view site


This project using [Jekyll::Compose](https://github.com/jekyll/jekyll-compose) plugin

## Usage

After you have installed (see above), run `bundle exec jekyll help` and you should see:

Listed in help you will see new commands available to you:

```sh
  draft      # Creates a new draft post with the given NAME
  post       # Creates a new post with the given NAME
  publish    # Moves a draft into the _posts directory and sets the date
  unpublish  # Moves a post back into the _drafts directory
  page       # Creates a new page with the given NAME
```

Create your new page using:

    $ bundle exec jekyll page "My New Page"

Create your new post using:

    $ bundle exec jekyll post "My New Post"

Create your new draft using:

    $ bundle exec jekyll draft "My new draft"

Publish your draft using:

    $ bundle exec jekyll publish _drafts/my-new-draft.md
    # or specify a specific date on which to publish it
    $ bundle exec jekyll publish _drafts/my-new-draft.md --date 2014-01-24

Unpublish your post using:

    $ bundle exec jekyll unpublish _posts/2014-01-24-my-new-draft.md
