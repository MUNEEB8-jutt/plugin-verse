# Database Fix Karne Ka Tareeqa (Urdu Guide)

## Problem Kya Thi?
Database mein column names camelCase mein the (jaise `priceCoins`) lekin code snake_case expect kar raha tha (jaise `price_coins`).

## Solution - 3 Options Hain:

### Option 1: Columns Rename Karo (Agar Data Save Karna Hai)

**Yeh use karo agar aapke paas already plugins ya deposits ka data hai jo aap delete nahi karna chahte.**

1. Supabase Dashboard kholo
2. SQL Editor mein jao (left sidebar mein)
3. `FIX_COLUMNS.sql` file kholo aur sab kuch copy karo
4. Supabase SQL Editor mein paste karo
5. "Run" button dabao

**Agar error aaye to:**
- `FIX_COLUMNS_SIMPLE.sql` file use karo
- Pehle check karo columns ka naam kya hai
- Phir ek ek command run karo

### Option 2: Fresh Start (Recommended - Agar Koi Important Data Nahi)

**Yeh sabse aasan hai agar abhi testing phase mein ho.**

1. Supabase Dashboard kholo
2. SQL Editor mein jao
3. `FRESH_SETUP.sql` file kholo aur run karo (yeh sab tables delete kar dega)
4. Phir `COMPLETE_SETUP.sql` file kholo aur run karo (yeh naye tables banayega)

### Option 3: Manual Reset

1. Supabase Dashboard > Database > Tables
2. Har table ko manually delete karo:
   - purchases
   - deposits  
   - plugins
   - settings
   - users
3. Phir `COMPLETE_SETUP.sql` run karo

## Verification (Check Karo Sab Theek Hai)

SQL Editor mein yeh command run karo:

```sql
SELECT column_name FROM information_schema.columns WHERE table_name = 'plugins';
```

**Aapko yeh dikhna chahiye:**
- id
- title
- description
- price_coins ✅ (NOT priceCoins)
- logo_url ✅ (NOT logoUrl)
- file_url ✅ (NOT fileUrl)
- created_at

Agar yeh sahi dikh raha hai, to sab theek hai! Ab plugin upload kaam karega.

## Files Ka Matlab:

- `FIX_COLUMNS.sql` - Automatic script jo columns rename kar degi
- `FIX_COLUMNS_SIMPLE.sql` - Manual commands agar automatic kaam na kare
- `FRESH_SETUP.sql` - Sab delete kar ke fresh start
- `COMPLETE_SETUP.sql` - Complete database setup (already exists)

## Agar Phir Bhi Problem Ho:

Discord ya support mein message karo, main help karunga!
