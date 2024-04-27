---
title: "How to Use a Custom Domain with GitHub Pages"
excerpt: "Learn how to set up a custom domain for your GitHub Pages website."
date: "2024-04-27T13:21:27.000Z"
keywords:
  - GitHub Pages Custom Domain
  - Setting Up Custom Domain on GitHub Pages
  - Cloudflare DNS Configuration
  - Custom Domain Setup Guide
  - Website Hosting with GitHub Pages
  - Cloudflare and GitHub Integration
  - GitHub Pages Domain Verification
---

In a [previous post](https://www.burakince.com/post/static-web-page-generation-on-github-pages-with-nextjs-and-tailwindcss/), you learned how to publish your static website using Next.js with the help of GitHub Pages. Now, let's explore how to use a custom domain for a website hosted on GitHub Pages, instead of the default `myusername.github.io` domain. This guide will walk you through the steps to set up your custom domain. Let's get started!

## Purchase a Custom Domain Name

First, ensure you have purchased a custom domain name. If you haven't, you can obtain one from a domain registration service of your choice. I personally use [Cloudflare](https://www.cloudflare.com/) for its many additional features and highly recommend it. However, feel free to choose any service that suits your needs.

## Verify Your Domain Name

Verifying your domain name is crucial to prevent unauthorized parties from using your domain for their own purposes. This process can be done through the Pages menu under Settings in your GitHub profile. For more detailed information, refer to the [official GitHub documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

Here is an example of my domain names as defined on GitHub:

![image of my domain names defined on GitHub](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_domain_names_defined_on_github.png)

## Set Up DNS on Your Domain Registration Service Provider

To connect your domain to your GitHub Pages website, you need to set up DNS records with your domain registration service provider. While the process is similar across different providers, I'll guide you through the setup on Cloudflare.

### Step 1: Configure A and AAAA Records

1. **A Record:** Create or modify an A type record using the 'Add record' button. Set the Name field to `@` to represent the root or enter your domain name without the `www` prefix. In the Content field, enter `192.0.2.1` and save the settings.

   Here's my configuration:

   ![image of my type A registration on Cloudflare](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_type_a_registration_on_cloudflare.png)

2. **AAAA Record:** Create or modify an AAAA type record using the 'Add record' button. As with the A record, set the Name field to `@` or your domain name without the `www` prefix. In the Content field, enter `100::` and save the settings.

   My configuration:

   ![image of my AAAA registration on Cloudflare](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_aaaa_registration_on_cloudflare.png)

### Step 2: Set Up CNAME Record

Next, add a CNAME record for the `www` prefix. If you already have one, edit it; otherwise, create a new record. Set the Name field to `www` and enter your GitHub Pages domain as the Target.

Here's my configuration:

![image of my record with CNAME type and name www which leads to my GitHub domain on Cloudflare](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_record_with_cname_type_and_name_www_which_leads_to_my_github_domain_on_cloudflare.png)

### Step 3: Configure Page Rules

Finally, set up a page rule to redirect non-`www` traffic to the `www` version with HTTPS:

1. Go to the Rules menu and select Page Rules.
2. Create a new page rule with your domain name ending in `/*` without the `www` prefix.
3. Set the rule to forward to the `www` version of your domain with HTTPS.
4. Save and deploy the page rule.

Here's my configuration:

![image of my page rule definition on Cloudflare](/assets/blog/how-to-use-a-custom-domain-with-github-pages/image_of_my_page_rule_definition_on_cloudflare.png)

## Add a CNAME File to Your GitHub Repository

Create a file named `CNAME` in your GitHub repository, with your custom domain name as the content. For instance, you can use the following command, replacing my domain name with yours:

```bash
echo "www.burakince.com" > CNAME
```

After committing the file and pushing it to your repository, open the Settings section of your GitHub repository. In the Pages settings, add your custom domain name with the `www` prefix and save the changes. For more detailed information, refer to the [official GitHub documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

Here's my configuration:

![my custom domain definition image on GitHub Pages](/assets/blog/how-to-use-a-custom-domain-with-github-pages/my_custom_domain_definition_image_on_github_pages.png)

Your GitHub Pages website should now be accessible via your custom domain name. I hope you found this guide helpful. Let me know if you have any further questions or need assistance!
