# Vercel Deployment Tutorial (Urdu) 🚀

## Step 1: Vercel Account Banao

1. **Browser mein jao:** https://vercel.com
2. **"Sign Up"** button pe click karo (top right corner mein)
3. **"Continue with GitHub"** pe click karo (black button)
4. Agar GitHub login nahi hai to login karo
5. Vercel ko permission do - **"Authorize Vercel"** button pe click karo
6. Done! Aapka Vercel account ban gaya

---

## Step 2: Project Import Karo

1. Vercel dashboard pe **"Add New"** button pe click karo (top right)
2. Dropdown mein se **"Project"** select karo
3. **"Import Git Repository"** section dikhega
4. Search box mein **"plugin-verse"** type karo
5. Apni repository dikhai degi - uske samne **"Import"** button pe click karo

---

## Step 3: Project Configure Karo

### A) Framework Settings (Automatic hai)
- **Framework Preset:** Next.js (already selected hoga)
- **Root Directory:** ./ (default)
- Kuch change karne ki zaroorat nahi

### B) Environment Variables (IMPORTANT!)

**Yeh 3 variables add karne ZAROORI hain:**

1. **"Environment Variables"** section dhundo (neeche scroll karo)
2. Pehla variable add karo:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** (Supabase se copy karo - neeche dekho kahan se)
   - **"Add"** button pe click karo

3. Doosra variable add karo:
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** (Supabase se copy karo)
   - **"Add"** button pe click karo

4. Teesra variable add karo:
   - **Key:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** (Supabase se copy karo)
   - **"Add"** button pe click karo

### Supabase Keys Kahan Se Milenge?

1. Supabase dashboard kholo: https://supabase.com
2. Apna project select karo
3. Left sidebar mein **"Project Settings"** (gear icon) pe click karo
4. **"API"** section pe click karo
5. Yahan 3 cheezein dikhegi:
   - **Project URL** → Yeh `NEXT_PUBLIC_SUPABASE_URL` hai
   - **anon public** key → Yeh `NEXT_PUBLIC_SUPABASE_ANON_KEY` hai
   - **service_role** key (secret) → Yeh `SUPABASE_SERVICE_ROLE_KEY` hai
6. Copy karo aur Vercel mein paste karo

---

## Step 4: Deploy Karo!

1. Sab settings check kar lo
2. Neeche **"Deploy"** button pe click karo (blue button)
3. Wait karo 2-3 minutes
4. Screen pe building progress dikhega:
   - Building...
   - Running Build Command...
   - Deploying...
5. Jab **"Congratulations!"** dikhe to done!

---

## Step 5: Apni Website Dekho

1. Deploy complete hone ke baad **"Visit"** button pe click karo
2. Ya **"Continue to Dashboard"** pe jao
3. Dashboard mein aapko URL milega:
   - **`https://plugin-verse-xxx.vercel.app`**
4. Yeh aapki live website hai! 🎉

---

## Step 6: Supabase Update Karo (IMPORTANT!)

Deploy hone ke baad Supabase mein URL add karna zaroori hai:

1. Supabase dashboard kholo
2. Left sidebar mein **"Authentication"** pe click karo
3. **"URL Configuration"** pe click karo
4. **Site URL** mein apna Vercel URL paste karo:
   - Example: `https://plugin-verse-xxx.vercel.app`
5. **Redirect URLs** mein yeh add karo:
   - `https://plugin-verse-xxx.vercel.app/**`
6. **"Save"** button pe click karo

---

## Step 7: Test Karo

1. Apni website kholo
2. **Signup** try karo - kaam karna chahiye
3. **Login** try karo
4. Admin panel check karo
5. Plugin upload try karo

---

## Troubleshooting (Agar Problem Ho)

### Problem 1: Build Fail Ho Jaye
**Solution:**
- Environment variables check karo
- Sab 3 variables add kiye hain?
- Values sahi hain?

### Problem 2: Login/Signup Kaam Nahi Kar Raha
**Solution:**
- Supabase URL Configuration check karo
- Vercel URL Supabase mein add kiya hai?

### Problem 3: Images/Videos Load Nahi Ho Rahe
**Solution:**
- Supabase Storage buckets PUBLIC hain?
- Bucket policies check karo

---

## Automatic Updates

Jab bhi aap code update karo:

```bash
git add .
git commit -m "Updated feature"
git push
```

Vercel automatically deploy kar dega! 🚀

---

## Custom Domain (Optional)

### Free Domain Options:

**Option 1: Vercel Subdomain (Already hai)**
- `plugin-verse-xxx.vercel.app` (FREE)

**Option 2: Freenom Domain**
1. https://www.freenom.com pe jao
2. Domain search karo (e.g., pluginverse.tk)
3. Free register karo (12 months)
4. Vercel mein domain add karo
5. DNS settings update karo

**Option 3: is-a.dev Subdomain**
1. https://github.com/is-a-dev/register
2. Pull request banao
3. Approval ke baad: `pluginverse.is-a.dev` (FREE forever!)

---

## Important Links

- **Aapka GitHub Repo:** https://github.com/MUNEEB8-jutt/plugin-verse
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## Summary

✅ Code GitHub pe upload ho gaya
✅ Vercel account ban gaya
✅ Project import ho gaya
✅ Environment variables add ho gaye
✅ Deploy ho gaya
✅ Website live hai!

**Aapki Website:** `https://plugin-verse-xxx.vercel.app`

---

## Need Help?

Agar koi problem ho to:
1. Vercel dashboard mein **"Deployments"** check karo
2. Error logs dekho
3. Environment variables dobara check karo

**All the best! 🚀**
