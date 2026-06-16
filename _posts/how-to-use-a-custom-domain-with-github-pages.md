---
title: "How to Use a Custom Domain with GitHub Pages"
excerpt: "Learn how to set up a custom domain for your GitHub Pages website."
date: "2024-04-27T13:21:27.000Z"
lastModified: "2026-06-16T16:02:03.000Z"
tags:
  - github-pages
  - dns
  - cloudflare
  - custom-domain
---

In a [previous post](https://www.burakince.com/post/static-web-page-generation-on-github-pages-with-nextjs-and-tailwindcss/), I covered how to publish a static Next.js site on GitHub Pages. This post covers pointing a custom domain at it instead of using the default `myusername.github.io` address.

## Purchase a custom domain name

First, make sure you have a custom domain. If not, you can register one through any domain registrar. I use [Cloudflare](https://www.cloudflare.com/) and recommend it for its extras, but any registrar works.

## Verify your domain name

Verifying your domain prevents unauthorized parties from claiming it and pointing it elsewhere. You can do this through the Pages menu under Settings in your GitHub profile. For details, refer to the [official GitHub documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

Here is an example of my domain names as defined on GitHub:

![image of my domain names defined on GitHub](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_domain_names_defined_on_github.png)

## Set up DNS on your domain registration service provider

To connect your domain to your GitHub Pages site, you need to add DNS records with your registrar. The steps below use Cloudflare.

### Step 1: Configure A and AAAA records

1. Add an A record: set Name to `@` (the root domain) and Content to `192.0.2.1`.

   Here's my configuration:

   ![image of my type A registration on Cloudflare](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_type_a_registration_on_cloudflare.png)

2. Add an AAAA record: set Name to `@` and Content to `100::`.

   My configuration:

   ![image of my AAAA registration on Cloudflare](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_aaaa_registration_on_cloudflare.png)

### Step 2: Set up CNAME record

Next, add a CNAME record for the `www` prefix. If you already have one, edit it; otherwise, create a new record. Set the Name field to `www` and enter your GitHub Pages domain as the target.

Here's my configuration:

![image of my record with CNAME type and name www which leads to my GitHub domain on Cloudflare](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_record_with_cname_type_and_name_www_which_leads_to_my_github_domain_on_cloudflare.png)

### Step 3: Configure page rules

Finally, set up a page rule to redirect non-`www` traffic to the `www` version with HTTPS:

1. Go to the Rules menu and select Page Rules.
2. Create a new page rule with your domain name ending in `/*` without the `www` prefix.
3. Set the rule to forward to the `www` version of your domain with HTTPS.
4. Save and deploy the page rule.

Here's my configuration:

![image of my page rule definition on Cloudflare](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_page_rule_definition_on_cloudflare.png)

## Add a CNAME file to your GitHub repository

Create a file named `CNAME` in your GitHub repository, with your custom domain name as the content. For instance, you can use the following command, replacing my domain name with yours:

```bash
echo "www.burakince.com" > CNAME
```

After committing and pushing, open your repository's Settings. In the Pages settings, add your custom domain with the `www` prefix and save. For details, refer to the [official GitHub documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

Here's my configuration:

![my custom domain definition image on GitHub Pages](/assets/blog/how-to-use-a-custom-domain-with-github-pages/my_custom_domain_definition_image_on_github_pages.png)

Your GitHub Pages site should now be accessible at your custom domain.
