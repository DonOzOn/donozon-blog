- **Image Preview**: Click any image to view full size with copyable URL

### Rich Text Editor

The enhanced editor provides:

- **Non-Aggressive Deletion**: Images aren't deleted during editing
- **Visual Feedback**: Shows count of images that will be cleaned up on save
- **Paste & Drop Support**: Easy image uploading with automatic tracking
- **Responsive Images**: All uploaded images are properly sized

### API Endpoints

#### Manual Cleanup
```bash
# Dry run (see what would be deleted)
POST /api/admin/images/cleanup
{
  "dryRun": true,
  "maxAge": 24,
  "batchSize": 50
}

# Actual cleanup
POST /api/admin/images/cleanup
{
  "dryRun": false,
  "maxAge": 48,
  "batchSize": 100
}
```

#### Batch Operations
```bash
# Delete specific images
POST /api/admin/images/batch
{
  "action": "delete",
  "imageIds": ["uuid1", "uuid2", "uuid3"]
}

# Sync all articles
POST /api/admin/images/batch
{
  "action": "sync"
}
```

## Automated Cleanup

### Cron Job Setup

Set up automated cleanup using your preferred cron service:

**Vercel Cron** (vercel.json):
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-images",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**GitHub Actions** (.github/workflows/cleanup.yml):
```yaml
name: Image Cleanup
on:
  schedule:
    - cron: '0 2 * * *'
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup Images
        run: |
          curl -X POST ${{ secrets.SITE_URL }}/api/cron/cleanup-images \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

**Manual Cleanup Commands**:
```bash
# Dry run to see what would be cleaned
npm run cleanup:images:dry-run

# Actual cleanup
npm run cleanup:images
```

### Cleanup Configuration

Default cleanup settings:
- **Grace Period**: 48 hours for unused images
- **Batch Size**: 100 images per cleanup run
- **Orphaned Images**: Deleted after 24 hours if not adopted
- **Featured Images**: Only deleted if not used in content

## Database Schema

### article_images Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `article_id` | UUID | Foreign key to articles (nullable for orphaned images) |
| `imagekit_file_id` | TEXT | ImageKit file identifier |
| `imagekit_url` | TEXT | Full ImageKit URL |
| `file_name` | TEXT | Original filename |
| `file_size` | INTEGER | File size in bytes |
| `mime_type` | TEXT | MIME type (image/jpeg, etc.) |
| `is_used` | BOOLEAN | Whether image is used in content |
| `is_featured_image` | BOOLEAN | Whether this is the article's featured image |
| `created_at` | TIMESTAMP | Upload timestamp |
| `marked_for_deletion_at` | TIMESTAMP | When marked for deletion |
| `deleted_at` | TIMESTAMP | When actually deleted |

### Key Functions

- `update_article_image_usage(article_id, content)` - Analyze content and update usage
- `cleanup_unused_images(grace_period_hours)` - Remove old unused images
- `get_global_image_stats()` - Get system-wide statistics
- `adopt_orphaned_images(article_id, image_urls)` - Claim orphaned images

## Best Practices

### For Developers

1. **Always use the enhanced service methods**:
   ```typescript
   // Good
   await imageManagementService.updateArticleImageUsageEnhanced(
     articleId, 
     content, 
     featuredImageUrl
   );
   
   // Avoid direct database calls
   ```

2. **Handle errors gracefully**:
   ```typescript
   try {
     await imageManagementService.updateArticleImageUsage(id, content);
   } catch (error) {
     console.warn('Image tracking failed:', error);
     // Don't fail the article save
   }
   ```

3. **Use TypeScript interfaces**:
   ```typescript
   import type { ArticleImage } from '@/services/image-management.service';
   ```

### For Content Creators

1. **Upload images through the editor** - ensures proper tracking
2. **Don't worry about deleting images during editing** - cleanup happens on save
3. **Use the admin interface to monitor storage** - check `/admin/images` regularly
4. **Set featured images properly** - they have special handling

### For System Administrators

1. **Monitor cleanup logs** - check success/failure of automated cleanup
2. **Set up monitoring webhooks** - get notified of cleanup results
3. **Regular database maintenance** - consider periodic VACUUM on article_images
4. **Backup strategy** - include article_images table in backups

## Troubleshooting

### Common Issues

**Images not being tracked:**
- Check if database migration was run: `npm run install:image-management`
- Verify Supabase permissions for the service role key
- Check browser console for API errors

**Cleanup not working:**
- Verify CRON_SECRET environment variable
- Check cron job configuration
- Test manually: `npm run cleanup:images:dry-run`

**High storage usage:**
- Run immediate cleanup: `/admin/images` → "Run Cleanup Job"
- Check for orphaned images in the admin interface
- Consider reducing grace period for unused images

**Images being deleted unexpectedly:**
- Check if images are properly referenced in article content
- Verify featured image URLs are correctly set
- Review cleanup logs for deletion reasons

### Debug Commands

```bash
# Check database functions
npx supabase db diff --linked

# Test image extraction
SELECT extract_imagekit_urls('your article content here');

# View image statistics
SELECT * FROM get_global_image_stats();

# Check cleanup eligibility
SELECT * FROM image_management_view WHERE image_status = 'unused';
```

## Performance Considerations

### Database Optimization

- Indexes are created on frequently queried columns
- Use the `image_management_view` for complex queries
- Consider partitioning for very large image tables (>1M images)

### Cleanup Efficiency

- Batch operations process images in chunks
- Grace periods prevent accidental deletions
- Monitoring helps track cleanup effectiveness

### API Rate Limits

- ImageKit deletion is throttled to avoid rate limits
- Failed deletions are logged and can be retried
- Bulk operations include error handling and partial success reporting

## Security

### Access Control

- Admin interface requires authentication
- Cron endpoints use secret token authentication
- Service role key is required for database operations

### Data Protection

- Soft deletes with grace periods prevent accidental loss
- Audit trail tracks all image operations
- Backup recommendations include image metadata

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review logs in `/admin/images` interface
3. Test with dry-run operations first
4. Check database connectivity and permissions

The image management system is designed to be safe, efficient, and maintainable. It provides comprehensive tracking while ensuring content integrity and storage optimization.
