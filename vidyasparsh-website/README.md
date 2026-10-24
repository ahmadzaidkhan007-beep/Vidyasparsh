# Vidyasparsh website – setup guide

1. **Supabase**: create a free project at supabase.com. Open SQL Editor, paste all of `supabase.sql`, click Run.
2. **Admin user**: Supabase > Authentication > Users > Add user. Use vidyasparsh786@gmail.com and a strong password you choose. Then Authentication > Sign In / Providers: turn OFF "Allow new users to sign up".
3. **Keys**: Project Settings > API. Copy the Project URL and the anon public key into `config.js`. Also set `domain` there.
4. **Test**: open `index.html` in a browser, then `admin.html` and log in.
5. **Deploy**: drag this whole folder onto app.netlify.com/drop. Add your domain in Domain management.
6. **Google**: after deploying, open admin > "Download sitemap.xml", put that file in this folder, deploy again. Then add the site in Google Search Console and submit /sitemap.xml. Also create a free Google Business Profile for your shop.

Edit text, phone numbers and address in `config.js`. Add or change books at /admin.html. Never share the Supabase service_role key.
