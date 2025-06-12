# 📷 Getting Data in `/admin/images`

Your `/admin/images` page is empty because the image management system isn't set up yet. Here's how to fix it:

## 🎯 **Why It's Empty**
- The `article_images` database table doesn't exist
- No image tracking is happening automatically  
- Images in articles aren't being catalogued

## 🚀 **Step-by-Step Fix**

### **Step 1: Run Database Migration**
1. **Open Supabase Dashboard**: https://supabase.com/dashboard/project/xhzurxmliuvexekfilfo/sql
2. **Copy entire content** from: `run-image-migration.sql`
3. **Paste** in SQL Editor
4. **Click "Run"** button

### **Step 2: Verify Migration Worked**
```bash
cd ~/Desktop/donozonblog
node verify-image-migration.mjs
```

### **Step 3: Backfill Existing Images**
```bash
cd ~/Desktop/donozonblog  
node backfill-images.mjs
```

### **Step 4: Test Image Management**
1. Visit: `http://localhost:3000/admin/images`
2. You should see your tracked images!

## 📋 **What Will Happen After Setup**

### **Automatic Tracking:**
- ✅ Images are tracked when articles are saved
- ✅ Unused images are marked for cleanup
- ✅ Featured images are identified
- ✅ Statistics are calculated

### **In `/admin/images` you'll see:**
- 📊 **Statistics**: Total, used, unused images
- 📷 **Image List**: All images with status
- 🗑️ **Cleanup Tools**: Delete unused images
- 📈 **Usage Tracking**: Which articles use which images

## 🔧 **Current Status**
- ✅ **Error handling**: Applied (no more crashes)
- ⏳ **Database setup**: Needs migration (Step 1)
- ⏳ **Data population**: Needs backfill (Step 3)

## 💡 **Expected Result**
After completing all steps, `/admin/images` will show:
- **1 article** with images found
- **1 image** being tracked
- **Full management interface** working

---

**Need Help?** All the required files are created for you:
- `run-image-migration.sql` - Database setup
- `verify-image-migration.mjs` - Test migration  
- `backfill-images.mjs` - Populate existing data
