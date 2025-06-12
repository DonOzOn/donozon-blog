# Auto-Delete ImageKit Images Feature

## Overview

This feature automatically deletes images from ImageKit.IO when they are removed from article content or when featured images are changed. This prevents storage bloat and reduces costs by ensuring unused images are cleaned up immediately.

## How It Works

### 1. Content Image Deletion
When you edit an article and remove images from the content:
- The system compares the previous content with the new content
- Identifies images that were removed
- Automatically deletes those images from ImageKit.IO
- Marks them as deleted in the database

### 2. Featured Image Deletion
When you change or remove a featured image:
- The previous featured image is automatically deleted from ImageKit.IO (if not used elsewhere in the content)
- The new featured image is tracked and marked as used

### 3. Rich Text Editor Integration
The rich text editor now tracks image changes in real-time:
- Detects when images are deleted from content
- Logs deletion events for debugging
- Integrates with the auto-deletion system

## Technical Implementation

### Enhanced Services

#### Image Management Service (`src/services/image-management.service.ts`)
- **`updateArticleImageUsage()`**: Now includes auto-deletion logic
- **`autoDeleteRemovedImages()`**: Handles ImageKit deletion and database cleanup
- **`trackFeaturedImage()`**: Auto-deletes previous featured images
- **`clearFeaturedImage()`**: Cleans up when featured images are removed

#### Article Service (`src/services/article.service.ts`)
- Enhanced `updateArticle()` method to handle featured image changes
- Compares previous and new featured images
- Triggers appropriate deletion logic

### New API Endpoint
- **`/api/admin/images/auto-delete`**: Immediate image deletion checking
- Used for real-time cleanup during content editing

### Rich Text Editor Updates
- **`RichTextEditorWithImageKit`**: Enhanced with deletion tracking
- Monitors content changes for removed images
- Provides visual feedback during image operations

## Configuration

The feature works with your existing ImageKit.IO configuration:

```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_endpoint
```

## Usage

### For Content Editors

1. **Edit an Article**
   - Go to `/admin/articles` and edit any article
   - Remove images from the content using the rich text editor
   - The images will be automatically deleted from ImageKit when you save

2. **Change Featured Images**
   - Upload a new featured image or remove the current one
   - The previous featured image will be automatically deleted (if not used in content)

3. **Visual Feedback**
   - Check browser console for deletion confirmation messages
   - Look for messages like: `✅ Successfully deleted image.jpg from ImageKit`

### For Developers

1. **Testing the Feature**
   ```bash
   node test-auto-delete-feature.mjs
   ```

2. **Monitor Deletion Events**
   - Check browser console during article editing
   - Look for auto-deletion logs in server console
   - Verify deletions in ImageKit.IO dashboard

3. **Debug Mode**
   - Detailed logging is enabled by default
   - Check console for deletion status and error messages

## Safety Features

### Graceful Fallbacks
- If ImageKit deletion fails, images are marked for cleanup
- Database operations continue even if ImageKit is unavailable
- Manual fallback when database functions are missing

### Validation
- Only deletes images that are actually unused
- Preserves images used in multiple places
- Handles network errors gracefully

### Logging
- Comprehensive logging for all deletion operations
- Success and failure notifications
- Detailed tracking of image status changes

## Benefits

1. **Cost Reduction**: Automatically removes unused images from ImageKit storage
2. **Storage Optimization**: Prevents accumulation of orphaned images
3. **Better Performance**: Reduced storage overhead
4. **User Experience**: Seamless integration with existing editing workflow
5. **Reliability**: Multiple fallback mechanisms ensure robustness

## Monitoring

### Console Messages
- `📷 Image tracking for article X: ...` - Image comparison results
- `🗑️ Auto-deleting N removed images from ImageKit...` - Deletion start
- `✅ Successfully deleted image.jpg from ImageKit` - Successful deletion
- `❌ Failed to delete image.jpg from ImageKit` - Deletion failure

### Database Tracking
Images are tracked in the `article_images` table with status fields:
- `is_used`: Whether the image is currently used
- `deleted_at`: When the image was deleted
- `marked_for_deletion_at`: When marked for cleanup

## Troubleshooting

### Common Issues

1. **"Image management functions not installed"**
   - Solution: Run the database migration for image management
   - The feature will use fallback mode until migration is complete

2. **"Failed to delete image from ImageKit"**
   - Check ImageKit credentials in environment variables
   - Verify network connectivity
   - Image will be marked for manual cleanup

3. **Images not being deleted**
   - Check console for error messages
   - Verify the image is actually unused
   - Ensure ImageKit credentials are correct

### Testing Checklist

- [ ] Environment variables configured
- [ ] Database migration completed
- [ ] Dev server running
- [ ] Console logging enabled
- [ ] ImageKit dashboard access available

## Future Enhancements

Potential improvements for future versions:
- Batch deletion for better performance
- Configurable deletion delays
- Admin panel for manual image cleanup
- Integration with CDN purging
- Image usage analytics

## Support

For issues or questions about this feature:
1. Check console logs for detailed error messages
2. Run the test script: `node test-auto-delete-feature.mjs`
3. Verify ImageKit.IO configuration
4. Check database migration status
